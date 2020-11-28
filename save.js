const save = async (tableName, data, db) => {
    const params = {
      TableName: tableName,
      Item: data
    };
    return new Promise(resolve => {
      db.put(params, error => {
        if (error) {
          console.log(`Event: Fail save ${params.Item.key}`);
          resolve();
        } else {
          delete data.key;
          resolve(data);
        }
      });
    });
  };
  
  module.exports.save = save;
  