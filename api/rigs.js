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

rigRouter.post('/', requireUser, async (req, res, next) => {
  try {
    const { newRig } = req.body;
    const addedRig = await createRig(newRig);
    res.send(addedRig);
  } catch (error) {
    console.log(error);
    res.next(error);
  }
});

rigRouter.delete('/:rigId', requireUser, async (req, res, next) => {
  try {
    const { rigId } = req.params;
    const deletedRig = await destroyRig(rigId);
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

    console.log('api for rig update reached, id:', rigId);
    console.log('rig data for update', newRigData)

    const updatedRig = await updateRig(rigId, newRigData);
    res.send(updatedRig);
  } catch (error) {
    console.error(error);
    next(error);
  }
})

module.exports = rigRouter;