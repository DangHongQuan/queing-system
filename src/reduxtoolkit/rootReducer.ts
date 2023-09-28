import { combineReducers } from '@reduxjs/toolkit';
import serviceReducer from './servicesSlice';
import devicesSlice from './DeviceSlice'
import NumberLeverSlice from './NumberLeverSlice';
import RolesSlice from './RolesSlice';
import UserSliec from './UserSliec';
import StorySlice from './StorySlice';
const rootReducer = combineReducers({
  service: serviceReducer,
  device: devicesSlice,
  numberlever: NumberLeverSlice,
  roles: RolesSlice,
  user: UserSliec,
  story: StorySlice,
});

export default rootReducer;
