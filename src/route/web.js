import express, { Route } from "express";
import userController from '../controllers/userController'
import doctorController from '../controllers/doctorController'
import clinicController from '../controllers/clinicController'
import specialtyController from '../controllers/specialtyController'
import patientController from '../controllers/patientController'
import postsController from '../controllers/postsController'
let router = express.Router();

let initWebRoutes = (app) => {
    //Login-USER
    router.post('/api/login', userController.handleLogin)
    router.post('/api/change-password', userController.handleChangePassword)
    router.post('/api/forgot-password', userController.handleForgotPassword)
    router.post('/api/verify-forgot-password', userController.verifyForgotPassword)
    router.get('/api/search-user-by-string', userController.searchUserByString)

    //SearchAll
    router.get('/api/search-all-string', userController.searchAllByString)


    //CRUD
    router.get('/api/get-all-users', userController.getAllUser)
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.put('/api/edit-user', userController.handleEditUser)

    //Allcode
    router.get('/api/get-allcode', userController.getAllCode)

    //Doctor
    router.get('/api/get-top-doctor', doctorController.getTopDoctor)
    router.get('/api/get-all-doctor', doctorController.getAllDoctor)
    router.post('/api/save-infor-doctor', doctorController.postInforDoctor)
    router.get('/api/get-detail-doctor', doctorController.getDetailDoctor)
    router.get('/api/get-detail-doctor-clinic-specialty', doctorController.detailDoctorClinicSpecialty)
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)
    router.get('/api/get-detail-clinic-doctor-by-id', doctorController.getDetailClinicDoctorById)
    router.get('/api/get-doctor-with-specialty-and-location-by-id', doctorController.getDoctorWithSpecialtyAndLocationById)
    router.get('/api/get-doctor-with-clinic-and-specialty-by-id', doctorController.getDoctorWithClinicSpecialtyById)

    //Search-doctor
    router.get('/api/search-doctor-by-string', doctorController.searchDoctorByString)

    //Doctor's Patient 
    router.get('/api/get-all-appointment-of-doctor', doctorController.getAllAppointmentOfDoctor)
    router.post('/api/send-remedy', doctorController.sendRemedy)

    //GetALLBill
    router.get('/api/get-all-bill-of-doctor', doctorController.getAllBillOfDoctor)
    router.get('/api/get-all-bill-of-doctor-with-week-month', doctorController.getAllBillWithWeekMonthOfDoctor)

    //Schedule
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)
    router.get('/api/get-detail-schedule', doctorController.getDetailSchedule)
    router.delete('/api/delete-schedule', doctorController.handleDeleteDetailSchedule)
    router.get('/api/get-detail-district-by-province', doctorController.getDetailDistrictByProvince)

    //Clinic
    router.get('/api/get-all-clinic', clinicController.getAllClinic)
    router.get('/api/get-detail-clinic', clinicController.getDetailClinic)
    router.post('/api/create-new-clinic', clinicController.postInforClinic)
    router.get('/api/get-detail-clinic', clinicController.getDetailClinic)

    //SearchClinic
    router.get('/api/search-clinic-by-string', clinicController.searchClinicByString)

    //Specialty
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty)
    router.post('/api/create-new-specialty', specialtyController.postInforSpecialty)
    router.get('/api/get-detail-specialty', specialtyController.getDetailSpecialty)

    //Booking
    router.post('/api/patient-book-appointment', patientController.postBookAppointment)
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment)

    //Posts
    router.get('/api/get-all-posts', postsController.getAllPosts)
    router.post('/api/post-new-posts', postsController.postNewPosts)
    router.delete('/api/delete-posts', postsController.deletePosts)
    router.get('/api/get-detail-posts', postsController.getDetailPosts)

    return app.use("/", router);
}

module.exports = initWebRoutes;