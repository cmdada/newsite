<script lang="ts">
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
1
    interface Product {
        id: string;
        name: string;
        description: string;
        price: string;
        image: string;
        category: 'harness' | 'Components' | 'custom';
        features: string[];
    }

    const products: Product[] = [
        {
            id: 'swerve-harness',
            name: 'Full swerve wiring harness - XT60 and ring terminal',
            description: 'Entirely sheathed and labeled wiring harness for your modern swerve needs - compatible with Kraken X60, Kraken x44, TalonFX, and XT60 Star Can.',
            price: '$300.00',
            image: '/swerve-harness.png',
            category: 'harness',
            features: ['10 Gauge power wires', '16 Gauge STP CAN', 'Genuine Amass XT60s', 'Crimped and Soldered ring terminals']
        },
        {
            id: 'xt60-starcan',
            name: 'XT60 Star CAN Module',
            description: 'Fully assembled module for connecting your entire robot with 24 impedance matched ports in a high-quality case',
            price: '$60.00',
            image: '/starcan.png',
            category: 'Components',
            features: ['Fully impedance matched', '2x12 port layout', 'Genuine Amass XT60s', 'Lead free PCB']
        },
        {
            id: 'custom-harness',
            name: 'Custom Wire Harness',
            description: 'Fully custom wire harness designed to your specifications',
            price: 'Contact for quote',
            image: '/placeholder2.jpeg',
            category: 'custom',
            features: ['Custom wire length', 'Any connector type', 'Your wire gauge', 'High-quality crimping and soldering']
        },
        {
            id: 'custom-components',
            name: 'Custom Components/Testing Rig',
            description: 'Custom electrical components, built-to-spec modules, or testing rigs built to your requirements',
            price: 'Contact for quote',
            image: '/placeholder.png',
            category: 'custom',
            features: ['PCB design available', 'Prototype to production', 'Testing and validation', 'Documentation and Support included', 'Microconrtoller programming available']
        }
    ];

    let selectedCategory: 'all' | 'harness' | 'Components' | 'custom' = 'all';
    let selectedProduct: Product | null = null;

    $: filteredProducts = selectedCategory === 'all' 
        ? products 
        : products.filter(p => p.category === selectedCategory);

    function openProductModal(product: Product) {
        selectedProduct = product;
    }

    function closeModal() {
        selectedProduct = null;
    }

    onMount(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedProduct) {
                closeModal();
            }
        };
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    });
</script>

<svelte:head>
    <title>site@adabit.org ~/wires</title>
</svelte:head>

<div class="content">
    <div class="header-section">
        <h1 class="page-title">Wire Harnesses & Custom Electrical work</h1>
        <p class="subtitle">Top quality wire harnesses, components, and custom electrical work for your project needs</p>
    </div>

    <div class="category-filter glass-element">
        <button 
            class="filter-btn" 
            class:active={selectedCategory === 'all'}
            on:click={() => selectedCategory = 'all'}
        >
            All Products
        </button>
        <button 
            class="filter-btn" 
            class:active={selectedCategory === 'harness'}
            on:click={() => selectedCategory = 'harness'}
        >
            Harnesses
        </button>
        <button 
            class="filter-btn" 
            class:active={selectedCategory === 'Components'}
            on:click={() => selectedCategory = 'Components'}
        >
            Components
        </button>
        <button 
            class="filter-btn" 
            class:active={selectedCategory === 'custom'}
            on:click={() => selectedCategory = 'custom'}
        >
            Custom Work
        </button>
    </div>

    <div class="products-grid">
        {#each filteredProducts as product (product.id)}
            <div 
                class="product-card glass-element" 
                on:click={() => openProductModal(product)}
                transition:fade
            >
                <div class="product-image">
                    <img src={product.image} alt={product.name} />
                    <div class="category-badge">{product.category}</div>
                </div>
                <div class="product-info">
                    <h3>{product.name}</h3>
                    <p class="product-description">{product.description}</p>
                    <div class="product-footer">
                        <span class="price">{product.price}</span>
                        <button class="details-btn">View Details</button>
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <div class="info-section glass-element">
        <h2>Why Choose Us?</h2>
        <div class="info-grid">
            <div class="info-item">
                <h3>High Quality</h3>
                <p>All harnesses are hand-crimped, back-soldered, and individually tested</p>
            </div>
            <div class="info-item">
                <h3>Time Saving</h3>
                <p>Skip the tedious crimping, cutting, and soldering - plug and play solutions</p>
            </div>
            <div class="info-item">
                <h3>Custom Fit</h3>
                <p>Designed for your specific application with proper wire routing and length</p>
            </div>
        </div>
    </div>

    <div class="contact-section glass-element">
        <h2>Ready to Order?</h2>
        <p>Contact me for custom quotes, bulk orders, or any questions about our wire harnesses and electrical components.</p>
        <div class="contact-buttons">
            <a href="mailto:wires@adabit.org" class="contact-btn primary">
                Email: wires@adabit.org
            </a>
            <a class="contact-btn secondary">
                Contact via Discord at @glowink
            </a>
        </div>
    </div>
</div>

{#if selectedProduct}
    <div class="modal" on:click={closeModal} transition:fade>
        <div class="modal-content glass-element" on:click|stopPropagation>
            <button class="close-btn" on:click={closeModal}>✕</button>
            <div class="modal-grid">
                <div class="modal-image">
                    <img src={selectedProduct.image} alt={selectedProduct.name} />
                </div>
                <div class="modal-details">
                    <h2>{selectedProduct.name}</h2>
                    <p class="modal-price">{selectedProduct.price}</p>
                    <p class="modal-description">{selectedProduct.description}</p>
                    
                    <h3>Features:</h3>
                    <ul class="features-list">
                        {#each selectedProduct.features as feature}
                            <li>{feature}</li>
                        {/each}
                    </ul>

                    <div class="modal-actions">
                        <a href="mailto:wires@adabit.org?subject=Order: {selectedProduct.name}" class="order-btn">
                            Contact to Order
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    .content {
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem;
    }

    .header-section {
        text-align: center;
        margin-bottom: 3rem;
        
        .page-title {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, var(--color-foam), var(--color-iris));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .subtitle {
            color: var(--color-subtle);
            font-size: 1.1rem;
            max-width: 800px;
            margin: 0 auto;
        }
    }

    .category-filter {
        display: flex;
        gap: 1rem;
        justify-content: center;
        padding: 1.5rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;

        .filter-btn {
            padding: 0.75rem 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.05);
            color: var(--color-text);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: inherit;
            font-size: 1rem;

            &:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateY(-2px);
            }

            &.active {
                background: linear-gradient(135deg, rgba(156, 207, 216, 0.3), rgba(196, 167, 231, 0.3));
                border-color: var(--color-foam);
                box-shadow: 0 0 20px rgba(156, 207, 216, 0.3);
            }
        }
    }

    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }

    .product-card {
        cursor: pointer;
        overflow: hidden;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;

        &:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .product-image {
            position: relative;
            width: 100%;
            aspect-ratio: 1;
            overflow: hidden;
            background: var(--color-overlay);

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .category-badge {
                position: absolute;
                top: 1rem;
                right: 1rem;
                padding: 0.5rem 1rem;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 6px;
                font-size: 0.85rem;
                text-transform: uppercase;
                font-weight: 600;
                color: var(--color-foam);
            }
        }

        .product-info {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            flex: 1;

            h3 {
                margin: 0 0 0.5rem 0;
                color: var(--color-text);
                font-size: 1.3rem;
            }

            .product-description {
                color: var(--color-subtle);
                margin-bottom: 1rem;
                flex: 1;
            }

            .product-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: auto;

                .price {
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: var(--color-foam);
                }

                .details-btn {
                    padding: 0.5rem 1rem;
                    background: rgba(156, 207, 216, 0.2);
                    border: 1px solid var(--color-foam);
                    border-radius: 6px;
                    color: var(--color-text);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: inherit;

                    &:hover {
                        background: rgba(156, 207, 216, 0.3);
                    }
                }
            }
        }
    }

    .info-section {
        padding: 3rem;
        margin-bottom: 2rem;

        h2 {
            text-align: center;
            margin-bottom: 2rem;
            font-size: 2rem;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;

            .info-item {
                h3 {
                    margin-bottom: 0.5rem;
                    color: var(--color-foam);
                }

                p {
                    color: var(--color-subtle);
                    line-height: 1.6;
                }
            }
        }
    }

    .contact-section {
        padding: 3rem;
        text-align: center;

        h2 {
            margin-bottom: 1rem;
            font-size: 2rem;
        }

        p {
            color: var(--color-subtle);
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }

        .contact-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;

            .contact-btn {
                padding: 1rem 2rem;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;
                font-size: 1.1rem;

                &.primary {
                    background: linear-gradient(135deg, var(--color-foam), var(--color-iris));
                    color: var(--color-base);
                    border: none;

                    &:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(156, 207, 216, 0.4);
                    }
                }

                &.secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--color-text);
                    border: 1px solid rgba(255, 255, 255, 0.2);

                    &:hover {
                        background: rgba(255, 255, 255, 0.15);
                    }
                }
            }
        }
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 2rem;

        .modal-content {
            max-width: 1000px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            padding: 2rem;

            .close-btn {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: var(--color-text);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.5rem;
                transition: all 0.3s ease;

                &:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            }

            .modal-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;

                .modal-image {
                    img {
                        width: 100%;
                        border-radius: 8px;
                    }
                }

                .modal-details {
                    h2 {
                        margin-top: 0;
                        color: var(--color-text);
                    }

                    .modal-price {
                        font-size: 1.8rem;
                        font-weight: 600;
                        color: var(--color-foam);
                        margin-bottom: 1rem;
                    }

                    .modal-description {
                        color: var(--color-subtle);
                        line-height: 1.6;
                        margin-bottom: 2rem;
                    }

                    h3 {
                        margin-top: 2rem;
                        margin-bottom: 1rem;
                        color: var(--color-foam);
                    }

                    .features-list {
                        list-style: none;
                        padding: 0;

                        li {
                            padding: 0.5rem 0;
                            color: var(--color-text);
                            
                            &::before {
                                content: "→ ";
                                color: var(--color-foam);
                                font-weight: 600;
                            }
                        }
                    }

                    .modal-actions {
                        margin-top: 2rem;

                        .order-btn {
                            display: inline-block;
                            padding: 1rem 2rem;
                            background: linear-gradient(135deg, var(--color-foam), var(--color-iris));
                            color: var(--color-base);
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: 600;
                            transition: all 0.3s ease;

                            &:hover {
                                transform: translateY(-2px);
                                box-shadow: 0 8px 20px rgba(156, 207, 216, 0.4);
                            }
                        }
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        .products-grid {
            grid-template-columns: 1fr;
        }

        .modal-content .modal-grid {
            grid-template-columns: 1fr !important;
        }

        .info-section .info-grid {
            grid-template-columns: 1fr;
        }

        .contact-section .contact-buttons {
            flex-direction: column;
        }
    }
</style>
