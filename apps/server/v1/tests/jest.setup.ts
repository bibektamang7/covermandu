import { prisma } from "db";

export async function resetDB() {
	const tablenames = await prisma.$queryRaw<
		Array<{ tablename: string }>
	>`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

	for (const { tablename } of tablenames) {
		if (tablename !== "_prisma_migrations") {
			try {
				await prisma.$executeRawUnsafe(
					`TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE`
				);
			} catch (error) {
				console.error(`Failed to truncate ${tablename}:`, error);
			}
		}
	}
}
