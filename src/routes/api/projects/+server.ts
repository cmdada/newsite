import type { RequestHandler } from './$types';
import db from '$lib/server/db';

const getProjectsStmt = db.prepare(`
    SELECT * FROM projects
`);

const getFilesStmt = db.prepare(`
    SELECT * FROM files WHERE projectId = ?
`);

const insertProjectStmt = db.prepare(`
    INSERT OR REPLACE INTO projects (id, name, description, createdDate, tags)
    VALUES (@id, @name, @description, @createdDate, @tags)
`);

const deleteFilesStmt = db.prepare(`DELETE FROM files WHERE projectId = ?`);
const deleteProjectStmt = db.prepare(`DELETE FROM projects WHERE id = ?`);

const insertFileStmt = db.prepare(`
    INSERT OR REPLACE INTO files (id, projectId, name, type, url, uploadDate, description)
    VALUES (@id, @projectId, @name, @type, @url, @uploadDate, @description)
`);

export const GET: RequestHandler = async () => {
    const projects = getProjectsStmt.all();
    const result = projects.map((proj) => {
        const files = getFilesStmt.all(proj.id);
        return {
            ...proj,
            createdDate: proj.createdDate,
            tags: proj.tags ? proj.tags.split(',') : [],
            files
        };
    });

    return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
    });
};

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();

    // wipe all projects and replace (frontend sends full array)
    const trx = db.transaction((projects) => {
        // clear existing projects
        db.prepare("DELETE FROM projects").run();
        db.prepare("DELETE FROM files").run();

        for (const proj of projects) {
            insertProjectStmt.run({
                id: proj.id,
                name: proj.name,
                description: proj.description,
                createdDate: proj.createdDate,
                tags: proj.tags.join(',')
            });

            for (const file of proj.files) {
                insertFileStmt.run({
                    id: file.id,
                    projectId: proj.id,
                    name: file.name,
                    type: file.type,
                    url: file.url,
                    uploadDate: file.uploadDate,
                    description: file.description
                });
            }
        }
    });

    trx(body);

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
    });
};
