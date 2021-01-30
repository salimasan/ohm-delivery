const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('db.json');
const config = require('../db.config.json');

const db = (async () => {
  const _db = await low(adapter);
  await _db.defaults(config).write();
  return _db;
})()

async function getOhmById(id) {
    const _db = await db;
    const ohm = _db.get('ohms')
        .find({ id })
        .value()

    return ohm;
}

async function updateOhmStatusById(id, newStatus, refuseDetail) {
    const _db = await db;


	//let ohm = _db.get('ohms')
    //    .find({ id })
	//ohm.status = newStatus;
	//ohm.refuseDetail = refuseDetail;
	//_db.write();
	
	
	
	_db.get('ohms')
  .find({ id: id })
  .assign({ status: newStatus}, { refuseDetail: refuseDetail} )
  .write()

    
}

module.exports = { getOhmById, updateOhmStatusById }