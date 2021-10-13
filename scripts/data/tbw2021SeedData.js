const seeder = require('mongoose-seed');
const dataSettings = require('./tbw2021AlertsSettingsData');

module.exports = () => {
    return new Promise((resolve, reject) => {
        try {
            return seeder.connect(process.env.MONGODB_URI, function () {
                seeder.loadModels([
                    'models/tbwSetting.js'
                ]);

                seeder.clearModels(['TBWSetting'], function () {
                    let data = [];

                    data.push(dataSettings);
                   
                    seeder.populateModels(data, function () {
                        resolve(true);
                    });
                });
            });
        } catch (err) {
            console.log(`Error seeding DB. Reason: ${err}`)
            reject(err);
        }
    });

}