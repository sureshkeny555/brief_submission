import { configureStore } from "@reduxjs/toolkit";
import briefs from '../store/features/briefsData'
import authorization from '../store/features/authorization'
import masters from '../store/features/master'


export default configureStore({
    reducer:{
        briefs,
        authorization,
        masters
    }
})
