import User from '../../../models/User.js';

export const storeDailyStepCount = async (req, res) => {
  const currUserId = req.body.currUserId;
  const steps = req.body.steps;
  const user = await User.findById(currUserId);
  const todaysDate = new Date().toDateString();
  let foundObjInd = user.health_data.findIndex(el => el.date === todaysDate);
  if (foundObjInd !== -1) {
    if (user.health_data[foundObjInd].step_count) {
      user.health_data[foundObjInd].step_count += steps;
    } else {
      user.health_data[foundObjInd].step_count = steps;
    }
  } else {
    foundObj = {
      date: todaysDate,
      step_count: steps,
      interaction: {
        working_alone: 0,
        working_with_colleagues: 0
      },
      sleep_hours: 0,
      working_hours: 0,
      vulnerability: 0
    };
    user.health_data.push(foundObj);
  }
  await user.save();
  res.status(200).send('OK');
};

export const storeDailySleepHours = async (req, res) => {
  const currUserId = req.body.currUserId;
  const sleepHours = req.body.steps;
  const user = await User.findById(currUserId);
  const todaysDate = new Date().toDateString();
  let foundObjInd = user.health_data.findIndex(el => el.date === todaysDate);
  if (foundObjInd !== -1) {
    if (user.health_data[foundObjInd].sleep_hours) {
      user.health_data[foundObjInd].sleep_hours += sleepHours;
    } else {
      user.health_data[foundObjInd].sleep_hours = sleepHours;
    }
  } else {
    const obj = {
      date: todaysDate,
      step_count: 0,
      interaction: {
        working_alone: 0,
        working_with_colleagues: 0
      },
      sleep_hours: sleepHours,
      working_hours: 0,
      vulnerability: 0
    };
    user.health_data.push(obj);
  }
  await user.save();
  res.status(200).send('OK');
};

export const workLife = async (req, res) => {
  const currUserId = req.body.currUserId;
  const inout = req.body.inout; // in or out
  const time = req.body.time;
  const user = await User.findById(currUserId);
  const todaysDate = new Date().toDateString();
  let foundObjInd = user.health_data.findIndex(el => el.date === todaysDate);
  let hours = 0;
  if (inout === 'in') {
    user.lastIn = time;
  } else {
    const diff = new Date(time) - new Date(user.lastIn);
    hours = diff / (1000 * 60 * 60);
  }

  if (foundObjInd !== -1) {
    if (user.health_data[foundObjInd].working_hours) {
      user.health_data[foundObjInd].working_hours += hours;
    } else {
      user.health_data[foundObjInd].working_hours = hours;
    }
  } else {
    const obj = {
      date: todaysDate,
      step_count: 0,
      interaction: {
        working_alone: 0,
        working_with_colleagues: 0
      },
      sleep_hours: 0,
      working_hours: hours,
      vulnerability: 0
    };
    user.health_data.push(obj);
  }
  await user.save();
  res.status(200).send('OK');
};

export const getWeekshealthData = async (req, res) => {
  const currUserId = req.body.currUserId;
  const userDetails = await User.findOne({});
  const today = new Date();
  const resp = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today.setDate(today.getDate() - i)).toDateString();
    const r = userDetails.health_data.filter(data => data.date === date);
    resp.push(r[0]);
  }
  res.status(200).send(resp);
};
