const get = async (tableName, key, db) => {
    const params = {
      TableName: tableName,
      Key: { key: key }
    };
    return new Promise(resolve => {
      db.get(params, (error, data) => {
        if (error || Object.keys(data).length === 0) {
          console.log(`Event: Fail getting or object not found`);
          resolve(null);
        } else {
          delete data.Item.key;
          resolve(data.Item);
        }
      });
    });
  };
  module.exports.get = get;
  