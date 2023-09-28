import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login/Login';
import ForgotPassword from './Login/ForgotPassword';
import ResetPassword from './Login/ResetPassword';
import HomeDasboard from './pages/HomeDasboard';
import DeviceApp from './pages/DeviceApp';
import PersoalAccount from './pages/PersonalAccount';
import AddDevice from './pages/AddDevice';
import Service from './pages/Service';
import AddService from './pages/addService';
import NumberLever from './pages/NumberLever';
import NewnumberLever from './pages/NewnumberLever';
import Report from './pages/Report';
import DetailDevice from './pages/DetailDevice';
import EditDevice from './pages/EditDevice';
import DetailServiceeee from './pages/DetailService';
import EditServiceeee from './pages/EditServiceeee';
import Roles from './pages/Roles';
import NewRoless from './pages/NewRoles';
import DetailNumberLever from './pages/DetailNumberlever';
import EditRoles from './pages/EditRoles';
import PageAccount from './pages/PageAcount';
import UpdateUsert from './pages/UpdateUset';
import NewAcount from './pages/NewAcount';
import Story from './pages/Story';
import Dropdown from './Login/DemoA';








function RouteApp() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/forgorpassword' element={<ForgotPassword />} />
        <Route path='/resetpassword' element={<ResetPassword />} />
        <Route path='/dasboard' element={<HomeDasboard />} />
        <Route path='/device' element={<DeviceApp />} />
        <Route path='/persoalaccount' element={<PersoalAccount />} />
        <Route path='/addDevice' element={<AddDevice />} />
        <Route path='/services' element={<Service />} />
        <Route path='/addService' element={<AddService />} />
        <Route path="/detailService/:id_sv" element={<DetailServiceeee />} />
        <Route path="/editService/:id_sv" element={<EditServiceeee />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/numbers" element={<NumberLever />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/detailDevice/:id" element={<DetailDevice />} />
        <Route path="/editDevice/:id" element={<EditDevice />} />
        <Route path="/editRoles/:name" element={<EditRoles />} />
        <Route path="/editUser/:email" element={<UpdateUsert />} />
        <Route path="/editnumberlever/:id_cs" element={<DetailNumberLever />} />
        <Route path="/addroles" element={<NewRoless />} />
        <Route path="/addNumberLever" element={<NewnumberLever />} />
        <Route path="/addcount" element={<NewAcount />} />
        <Route path="/accounts" element={<PageAccount />} />
        <Route path="/users" element={<Story />} />
        <Route path="/a" element={<Dropdown/>}/>


      </Routes>
    </BrowserRouter>
  )
}

export default RouteApp