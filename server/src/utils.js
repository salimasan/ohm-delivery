const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('db.json');
const config = require('../db.config.json');

const db = (async () => {
  const _db = await low(adapter);
  await _db.defaults(config).write();
  return _db;
})()

async function getOhmByTrackingId(trackingId) {
    const _db = await db;
    const ohm = _db.get('ohms')
        .find({ trackingId: trackingId })
        .value()

    return ohm;
}

async function updateOhmStatusByTrackingId(newStatus, trackingId, refuseDetail) {
    const _db = await db;
	// Add status transation to history object, we will update history below
	let history = _db.get('ohms')
        .find({ trackingId: trackingId }).value().history;
	history.push({state: newStatus, at: new Date().yyyymmdd()});
		
	// Update values at DB
	_db.get('ohms')
  .find({ trackingId: trackingId })
  .assign({ status: newStatus}, { refuseDetail: refuseDetail} , { history : history} )
  .write()
}

async function proceedOhmStatusByTrackingId(ohm) {
    const _db = await db;
	// Add status transation to history object, we will update history below
	let history = _db.get('ohms')
        .find({ trackingId: trackingId }).value().history;
	history.push({state: newStatus, at: new Date().yyyymmdd()});
	
	_db.get('ohms')
  .find({ trackingId: ohm.trackingId })
  .assign({ status: ohm.status} , { history : history} )
  .write()
}

async function insertNewOhm(ohm) {
    const _db = await db;
    _db.get('ohms')
	.push(ohm)
	.write()
}

// I am ommiting the case of simultenaous access to this function and simultenaous inserts to DB
async function getMaxId() {
   const _db = await db;
   let [highest] =  _db.get('ohms').sort((a,b)=>   b.id - a.id)
   return highest.id
}

async function addCommentByTrackingId(trackingId, comment) {
    const _db = await db;
	
	_db.get('ohms')
  .find({ trackingId: trackingId })
  .assign({ comment: comment} )
  .write()
}


module.exports = { getOhmByTrackingId, updateOhmStatusByTrackingId, proceedOhmStatusByTrackingId, insertNewOhm, getMaxId, addCommentByTrackingId}