require('dotenv').config();

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }
});

async function importData() {
    try {
    
        // Get datas from API
        const response = await fetch(process.env.API_URL);
        const datas = await response.json();
        const companiesResult = datas.results;
  
        // Loop on datas, check if they exist, update them if they do, add them if they do not
        for (const company of companiesResult) {

            const existingCompany = await knex('companies').where('siren', company.siren).first();
            let companyId;

            if (existingCompany) {

                 // Update company infos
                companyId = existingCompany.id;
                await knex('companies').where('id', existingCompany.id).update({
                    siren: company.siren,
                    name: company.nom_complet,
                    nb_establishments: company.nombre_etablissements
                });

            } else {

                // Add new company infos
                companyId = await knex('companies').insert({
                    siren: company.siren,
                    name: company.nom_complet,
                    nb_establishments: company.nombre_etablissements
                });
            }
    
            for (const establishment of company.matching_etablissements) {
                const existingEstablishment = await knex('establishments').where('address_establishment', establishment.adresse).first();
    
                if (existingEstablishment) {

                    // Update establishment infos
                    await knex('establishments').where('id', existingEstablishment.id).update({
                        company_id: companyId,
                        address_establishment: establishment.adresse,
                        latitude_establishment: establishment.latitude,
                        longitude_establishment: establishment.longitude
                    });
                } else {

                    // Add new establishment infos
                    await knex('establishments').insert({
                        company_id: companyId,
                        address_establishment: establishment.adresse,
                        latitude_establishment: establishment.latitude,
                        longitude_establishment: establishment.longitude
                    });
                }
            }
        }
    
        console.log('Import completed successfully.');

        knex.destroy();

    } catch (error) {
        console.error('Import failed:', error);
    }
  }
  
  importData();