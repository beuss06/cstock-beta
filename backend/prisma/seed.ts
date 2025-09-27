import { PrismaClient, Role, LocationType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cstock.local' },
    update: {},
    create: { email: 'admin@cstock.local', name: 'Admin', password: adminPass, role: Role.ADMIN },
  });

  // 17 chantiers de base + 1 dépôt
  const depot = await prisma.location.upsert({
    where: { name: 'Dépôt principal' },
    update: {},
    create: { name: 'Dépôt principal', type: LocationType.DEPOT },
  });

  const chantierNames = [
    'Maraterra', 'Tour CMB', 'Victor Palace', 'Hermitage',
    'Chantier 5', 'Chantier 6', 'Chantier 7', 'Chantier 8', 'Chantier 9',
    'Chantier 10', 'Chantier 11', 'Chantier 12', 'Chantier 13',
    'Chantier 14', 'Chantier 15', 'Chantier 16', 'Chantier 17',
  ];

  for (const name of chantierNames) {
    await prisma.location.upsert({
      where: { name },
      update: {},
      create: { name, type: LocationType.CHANTIER },
    });
  }

  // Exemple de fournisseur + article
  const supplier = await prisma.supplier.create({
    data: { name: 'Fournisseur Démo', siret: '12345678900011' }
  });

  const item = await prisma.item.create({
    data: {
      refCode: 'REF-0001',
      label: 'Vis M6x20',
      ean: '1234567890123',
      unit: 'pièce',
      supplierId: supplier.id,
      stocks: {
        create: [
          { locationId: depot.id, qty: 500, minThreshold: 100 }
        ]
      }
    }
  });

  console.log('Seed terminé.', { admin: admin.email, item: item.refCode });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
