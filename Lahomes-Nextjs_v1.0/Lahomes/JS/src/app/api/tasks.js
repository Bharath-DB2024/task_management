import db from '@/lib/db';

export default async function handler(req, res) {
    const { adminId } = req.query;

    if (req.method === 'GET') {
        try {
            const query = `
                SELECT instructor_name, 
                       COUNT(*) AS total_tasks, 
                       SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS completed_tasks
                FROM tasks
                WHERE admin_unique_id = ?
                GROUP BY instructor_name
            `;
            const [rows] = await db.execute(query, [adminId]);

            res.status(200).json(rows);
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
