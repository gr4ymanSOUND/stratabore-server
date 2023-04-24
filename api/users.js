const userRouter = require('express').Router();
const { requireUser } = require('../api/utils');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const {
    getUser,
    getUserById,
    getAllUsers,
    updateUser,
    createUser
} = require('../db/models/users');

userRouter.get('/', requireUser, async (req, res, next) => {
  const prefix = 'Bearer ';
  try {
    const auth = req.headers.authorization;
    const token = auth.slice(prefix.length);
    let authorizedUser = jwt.verify(token, secret);
    if (authorizedUser.username) {
      const allUsers = await getAllUsers();
      res.send(allUsers)
    } else {
      throw new Error('error getting all user info');
    }
  } catch (error) {
    next(error);
  }
});

// create new users from the user form
userRouter.post('/create', requireUser, async (req, res, next) => {  
  try {
    const { newUserData } = req.body;
    const newUser = createUser(newUserData);
    res.send(newUser);
  } catch (error) {
    next(error);
  }
});

// api/users/login sets `user` to the request body which getUser() destructures
userRouter.post('/login', async (req, res, next) => {
  const { userName, password } = req.body;
  try {
    const user = await getUser({userName, password})

    const token = jwt.sign({username: user.userName, id: user.id}, secret)

    const confirmation = {
      message: "you're logged in!",
      token: token,
      user: user
    }
    res.send(confirmation);
  } catch (error) {
    next(error);
  }
});

userRouter.get('/me', requireUser, async (req, res, next) => {
    const prefix = 'Bearer ';
    try {
      const auth = req.headers.authorization;
      const token = auth.slice(prefix.length);
      
      let authorizedUser = jwt.verify(token, secret);
      if (authorizedUser.username) {
        const me = await getUserById(authorizedUser.id);
        res.send(me)
      } else {
        throw new Error('error getting user info');
      }
    } catch (error) {
      next(error);
    }
});

userRouter.patch('/:userId', requireUser, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { newUserData } = req.body;
    const updatedUser = await updateUser(userId, newUserData);
    res.send(updatedUser);
  } catch (error) {
    console.error(error);
    next(error);
  }

});

userRouter.delete('/:userId', requireUser, async (req, res, next) => {
  try {
    const { rigId } = req.params;
    const newUserData = {status: 'inactive'}
    const deletedUser = await updateUser(userId, newUserData);
    res.send(deletedUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
})


module.exports = userRouter;