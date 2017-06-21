/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START build_service]
// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GCLOUD_PROJECT environment variable. See
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/datastore/latest/guides/authentication
const Datastore = require('@google-cloud/datastore');

// Instantiates a client
const datastore = Datastore();
// [END build_service]

/*
Installation and setup instructions.
1. Download the TaskList sample application from [here]
(https://github.com/GoogleCloudPlatform/nodejs-docs-samples/archive/master.zip).

2. Unzip the download:
```sh
unzip nodejs-docs-samples-master.zip
```

3. Change directories to the TaskList application:
```sh
cd nodejs-docs-samples-master/datastore
```

4. Install the dependencies and link the application:
```sh
npm install
```

5. With the gcloud SDK, be sure you are authenticated:
```sh
gcloud beta auth application-default login
```

6. At a command prompt, run the following, where `<project-id>` is the ID of
your Google Cloud Platform project.
```sh
export GCLOUD_PROJECT=<project-id>
```

7. Run the application!
```sh
node tasks <command>
```
*/

// [START add_entity]
function addTask(description) {

    var fs = require("fs");
    var path = require('path');

    var dataDir = "D:/DEV/aneml-master/aneml-master/setup/tweet-data/";

    fs.readdir(dataDir, function(err, files) {
        if (err) {
            console.error("Could not list the directory.", err);
            process.exit(1);
        }

        files.forEach(function(file, index) {
            console.log(dataDir + file);
            // Get content from file
            var contents = fs.readFileSync(dataDir + file);
            // Define to JSON type
            var jsonContent = JSON.parse(contents);

            const taskKey = datastore.key('tweet');
            const entity = {
                key: taskKey,
                data: [{
                        name: 'created',
                        value: new Date().toJSON()
                    },
                    {
                        name: 'screen_name',
                        value: jsonContent.user.screen_name
                    },
                    {
                        name: 'name',
                        value: jsonContent.user.name
                    },
                    {
                        name: 'locaiton',
                        value: jsonContent.user.location
                    },
                    {
                        name: 'tweet_text',
                        value: jsonContent.text
                    },
                    {
                        name: 'tweet',
                        value: jsonContent
                    }
                ]
            };

            datastore.save(entity)
                .then(() => {
                    console.log(`Task ${taskKey.id} created successfully.`);
                })
                .catch((err) => {
                    console.error('ERROR:', err);
                });

        });
    });

}
// [END add_entity]

// [START retrieve_entities]
function listTasks() {
    const query = datastore.createQuery('tweet')
        .order('created');

    datastore.runQuery(query)
        .then((results) => {
            const tasks = results[0];

            console.log('tweetss:');
            tasks.forEach((task) => {
                const taskKey = task[datastore.KEY];
                console.log(taskKey.id, task);
            });
        })
        .catch((err) => {
            console.error('ERROR:', err);
        });
}
// [END retrieve_entities]
//addTask("du");
listTasks();