const rigRouter = require('express').Router();
const { requireUser } = require('../api/utils');
const { getAllRigs, createRig, destroyRig, updateRig } = require('../db/models/rigs');

rigRouter.get('/', requireUser, async (req, res, next) => {
  try {
    const rigs = await getAllRigs();
    res.send(rigs);
  } catch (error) {
    console.log(error);
    res.next(error);
  }
});

rigRouter.post('/create', requireUser, async (req, res, next) => {
  try {
    const { newRigData } = req.body;
    const addedRig = await createRig(newRigData);
    res.send(addedRig);
  } catch (error) {
    console.log(error);
    res.next(error);
  }
});

// now updating to inactive status instead
rigRouter.delete('/:rigId', requireUser, async (req, res, next) => {
  try {
    const { rigId } = req.params;
    const newRigData = {status: 'inactive'}
    const deletedRig = await updateRig(rigId, newRigData);
    res.send(deletedRig);
  } catch (error) {
    console.error(error);
    next(error);
  }
})

rigRouter.patch('/:rigId', requireUser, async (req, res, next) => {
  try {
    const { rigId } = req.params;
    const { newRigData } = req.body;
    const updatedRig = await updateRig(rigId, newRigData);
    res.send(updatedRig);
  } catch (error) {
    console.error(error);
    next(error);
  }
})

// module.exports = rigRouter;
export { rigRouter };