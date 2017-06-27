module.exports = {


    search: function(searchTerm, callback) {

        const Datastore = require('@google-cloud/datastore');

        // Instantiates a client
        const datastore = Datastore();

        // [START retrieve_entities]
        const query = datastore.createQuery('tweet')
            .order('created');
        datastore.runQuery(query)
            .then((results) => {
                const tasks = results[0];

                console.log('tweetss:');
                tasks.forEach((task) => {
                    const taskKey = task[datastore.KEY];
                    console.log(taskKey.id, "tweet");
                });
                return callback(JSON.stringify(tasks, null, 4));
            })
            .catch((err) => {
                console.error('ERROR:', err);
            });
    }
}