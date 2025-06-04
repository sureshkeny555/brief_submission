import { createSlice } from "@reduxjs/toolkit";
import { client } from "../../utils/client";
// import { updateErrorMessage, updateSuccessMessage } from "./authorization";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import axios from "axios";
import { data } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import { get } from "react-hook-form";

export const briefSlice = createSlice({
  name: "briefs",
  initialState: {
    newBriefData: "",
    inputValue: [],
    getAllBrief: [],
    receiverBriefStatus: [],
    acceptBrief: [],
    rejectBriefTrack: [],
    allBriefPage: 1,
    todayBriefPage: 1,
    currentPage: 1,
    briefsCount: 0,
    creatorBriefStatus: [],
    todayBriefStatus: [],
    calculateDate: "",
    allocateStudy: [],
    allocateMember: [],
    allocateBriefId: [],
    clearDate: "",
    images: null,
    uploadFile: null,
    errorMessage: null,
    successMessage: null,
    searchTerm: [],
    searchCount: 0,
    countsValue: "",
    selectedStatus: "All",
    studyDropdown: [],
    studySubmittedActivity: [],
    studySubmit: [],
    dashboardCountValues: [],
    dashboardBarchartValues: [],
    dashboardTablePast: [],
    dashboardTableNext: [],
    dashboardDonutchartValues: [],
    dashboardBarchartValuesSearch: [],
  },
  reducers: {
    updateNewBriefData: (state, action) => {
      state.newBriefData = action.payload;
    },
    updateInputValue: (state, action) => {
      state.inputValue = action.payload;
    },
    updateGetAllBrief: (state, action) => {
      state.getAllBrief = action.payload;
    },
    updateAcceptBriefTrack: (state, action) => {
      state.acceptBrief = action.payload;
    },
    updateBriefStatus: (state, action) => {
      state.creatorBriefStatus = action.payload;
    },
    updateTodayBriefPage: (state, action) => {
      state.todayBriefPage = action.payload;
    },
    updateShowAllBriefPage: (state, action) => {
      state.allBriefPage = action.payload;
    },
    updateCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    updateTodayBriefStatus: (state, action) => {
      state.todayBriefStatus = action.payload;
    },
    updateCalculateDate: (state, action) => {
      state.calculateDate = action.payload;
    },
    updateAllocateStudy: (state, action) => {
      state.allocateStudy = action.payload;
    },
    updateGetAllocateMember: (state, action) => {
      state.allocateMember = action.payload;
    },
    updateBriefsCount: (state, action) => {
      state.briefsCount = action.payload;
    },
    updateGetllocateBriefId: (state, action) => {
      state.allocateBriefId = action.payload;
    },
    updateRejectBriefId: (state, action) => {
      state.rejectBriefTrack = action.payload;
    },
    updateReceiverBriefStatus: (state, action) => {
      state.receiverBriefStatus = action.payload;
    },
    updateImages: (state, action) => {
      state.images = action.payload;
    },
    UpdateClearCalculatedDate: (state, action) => {
      state.clearDate = action.payload;
    },
    updateUploadFile: (state, action) => {
      state.uploadFile = action.payload;
    },
    updateErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    updateSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
      state.errorMessage = null;
    },
    updateResetMessage: (state, action) => {
      state.errorMessage = null;
      state.successMessage = null;
    },
    updateSearchValues: (state, action) => {
      state.searchTerm = action.payload;
    },
    updateSearchCount: (state, action) => {
      state.searchCount = action.payload;
    },
    updateCountsValue: (state, action) => {
      state.countsValue = action.payload;
    },
    updateSetSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    UpdatestudyDropDown: (state, action) => {
      state.studyDropdown = action.payload;
    },
    UpdateStudySubmittedActivity: (state, action) => {
      state.studySubmittedActivity = action.payload;
    },
    UpdateStudySubmit: (state, action) => {
      state.studySubmit = action.payload;
    },
    updateDashboardCountValues: (state, action) => {
      state.dashboardCountValues = action.payload;
    },
    updateDashboardBarchartValues: (state, action) => {
      state.dashboardBarchartValues = action.payload;
    },
    updateDashboardTablePast: (state, action) => {
      state.dashboardTablePast = action.payload;
    },
    updateDashboardTableNext: (state, action) => {
      state.dashboardTableNext = action.payload;
    },
    updateDashboardDonutchartValues: (state, action) => {
      state.dashboardDonutchartValues = action.payload;
    },
    updateDashboardBarchartValuesSearch: (state, action) => {
      state.dashboardBarchartValuesSearch = action.payload;
    },
  },
});
export const {
  updateNewBriefData,
  updateInputValue,
  updateGetAllBrief,
  updateAcceptBriefTrack,
  updateBriefStatus,
  updateCurrentPage,
  updateTodayBriefStatus,
  updateCalculateDate,
  updateAllocateStudy,
  updateGetAllocateMember,
  updateBriefsCount,
  updateGetllocateBriefId,
  updateRejectBriefId,
  updateReceiverBriefStatus,
  updateShowAllBriefPage,
  updateTodayBriefPage,
  updateImages,
  UpdateClearCalculatedDate,
  updateUploadFile,
  updateErrorMessage,
  updateSuccessMessage,
  updateResetMessage,
  updateSearchValues,
  updateSearchCount,
  updateCountsValue,
  updateSetSelectedStatus,
  UpdatestudyDropDown,
  UpdateStudySubmittedActivity,
  UpdateStudySubmit,
  updateDashboardCountValues,
  updateDashboardBarchartValues,
  updateDashboardTablePast,
  updateDashboardTableNext,
  updateDashboardDonutchartValues,
  updateDashboardBarchartValuesSearch,
} = briefSlice.actions;
export default briefSlice.reducer;

export const createBrief = (formData) => async (dispatch) => {
  const accesstoken = localStorage.getItem("token");

  try {
    const response = await client.post("/submit_brief", formData, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });

    console.log("Response from API:", response);

    if (
      response?.data?.statusCode === 201 &&
      response.data?.message?.includes("successfully")
    ) {
      dispatch(updateNewBriefData(response.data));
      dispatch(updateSuccessMessage(response?.data?.message));
      return { status: "success", data: response.data };
    } else {
      console.error("API Error:", response.data.message || "Unknown error");
      dispatch(updateErrorMessage(response?.data?.message));
      return {
        status: "error",
        message: response.data.message || "Failed to submit brief",
      };
    }
  } catch (error) {
    console.error("Network Error:", error.message);
    dispatch(updateErrorMessage(response?.data?.message));
    return { status: "error", message: "Network error. Please try again." };
  }
};

export const getBriefInput = () => async (dispatch, getState) => {
  try {
    const { data } = await client.get("/dropdown");
    dispatch(updateInputValue(data));
  } catch (error) {
    console.error("Error fetching brief input:", error);
  }
};

export const getBriefStatus = (newPage) => async (dispatch, getState) => {
  try {
    //const pageNo = newPage || getState()?.briefs?.currentPage || 1;
    const pageSize = 10;
    const fetch_all = true;
    const url = `/reviewer/all_briefs?fetch_all=${fetch_all}&page=${newPage}&page_size=${pageSize}`;

    const response = await client.get(url);
    const { data } = response;

    dispatch(updateGetAllBrief(data));
    dispatch(updateBriefsCount(data?.pagination?.total_records));
    dispatch(updateShowAllBriefPage(data?.pagination?.page));
  } catch (error) {
    console.error("Error", error);
  }
};
export const getBriefStatusSearch =
  (search, page) => async (dispatch, getState) => {
    try {
      //const pageNo = newPage || getState()?.briefs?.currentPage || 1;
      const pageSize = 10;
      const url = `/reviewer/all_briefs?search_value=${search}&page=${page}&page_size=${pageSize}`;

      const response = await client.get(url);
      const { data } = response;

      dispatch(updateSearchValues(data));
      dispatch(updateSearchCount(data?.pagination?.total_records));
      dispatch(updateShowAllBriefPage(data?.pagination?.page));
    } catch (error) {
      console.error("Error", error);
    }
  };
export const getBriefStatusPagination =
  (newPage) => async (dispatch, getState) => {
    try {
      //const pageNo = newPage || getState()?.briefs?.currentPage || 1;
      const pageSize = 10;
      const url = `/reviewer/all_briefs?page=${newPage}&page_size=${pageSize}`;

      const response = await client.get(url);
      const { data } = response;

      dispatch(updateGetAllBrief(data));
      dispatch(updateBriefsCount(data?.pagination?.total_records));
      dispatch(updateShowAllBriefPage(data?.pagination?.page));
    } catch (error) {
      console.error("Error", error);
    }
  };

export const getTodayBriefStatus =
  (currentPage) => async (dispatch, getState) => {
    try {
      //const pageNo = newPage || getState()?.briefs?.currentPage || 1;
      const pageSize = 10;
      const url = `/reviewer/todays_deadlines?page=${currentPage}&page_size=${pageSize}`;
      const response = await client.get(url);
      const { data } = response;

      dispatch(updateTodayBriefStatus(data));
      dispatch(updateBriefsCount(data?.pagination?.total_records));
      dispatch(updateTodayBriefPage(data?.pagination?.page));
    } catch (error) {
      console.error("Error", error);
    }
  };
export const getTodayBriefStatusSearch =
  (search, page) => async (dispatch, getState) => {
    try {
      //const pageNo = newPage || getState()?.briefs?.currentPage || 1;
      const pageSize = 10;
      const url = `/reviewer/todays_deadlines?search_value=${search}&page=${page}&page_size=${pageSize}`;
      const response = await client.get(url);
      const { data } = response;

      dispatch(updateSearchValues(data));
      dispatch(updateSearchCount(data?.pagination?.total_records));
      dispatch(updateTodayBriefPage(data?.pagination?.page));
    } catch (error) {
      console.error("Error", error);
    }
  };

export const acceptBriefTrack = (formData, briefId) => async (dispatch) => {
  try {
    //approve_brief/<int:brief_id>
    const url = `/approve_brief/${briefId}`;
    const { status, data } = await client.put(url, formData, {
      includeAuthorization: true,
    });
    console.log("approve_brief", data.message);
    if (status) {
      dispatch(updateAcceptBriefTrack(data));
      dispatch(updateSuccessMessage(data?.message));
    } else {
      dispatch(updateErrorMessage(data?.message));
    }
  } catch (error) {
    console.error("Error submitting brief:", error);
  }
};

export const acceptBriefTrackCreator = (briefId) => async (dispatch) => {
  try {
    //approve_brief/<int:brief_id>
    const url = `/approve_brief/${briefId}`;
    const { status, data } = await client.put(url, {
      includeAuthorization: true,
    });
    console.log("approve_brief", data);
    if (status) {
      dispatch(updateAcceptBriefTrack(data));
    }
  } catch (error) {
    console.error("Error submitting brief:", error);
  }
};

export const getCreatorBrieftStatus = (newPage, status) => async (dispatch) => {
  try {
    // &status=${status}
    const pageSize = 10;
    const url = `/brief_status?page=${newPage}&page_size=${pageSize}`;
    // `/reviewer/all_briefs?page=${newPage}&page_size=${pageSize}`;
    const response = await client.get(url);
    const { data } = response;
    dispatch(updateBriefStatus(data));
    dispatch(updateBriefsCount(data?.pagination?.total_records));
    dispatch(updateCurrentPage(data?.pagination?.page));
  } catch (error) {
    console.log({ error });
  }
};
export const getCreatorBrieftStatusSearch =
  (search, page) => async (dispatch) => {
    try {
      // &status=${status}
      const pageSize = 10;
      const url = `/brief_status?search_value=${search}&page=${page}&page_size=${pageSize}`;
      // `/reviewer/all_briefs?page=${newPage}&page_size=${pageSize}`;
      const response = await client.get(url);
      const { data } = response;
      dispatch(updateSearchValues(data));
      dispatch(updateSearchCount(data?.pagination?.total_records));
      dispatch(updateCurrentPage(data?.pagination?.page));
    } catch (error) {
      console.log({ error });
    }
  };
export const getReceiverBrieftStatus =
  (newPage, status, searchQuery) => async (dispatch) => {
    try {
      const pageSize = 10;
      // &search_value=${searchQuery}
      const url = `/reviewer/brief_status?page=${newPage}&page_size=${pageSize}&status=${status}`;
      const response = await client.get(url);
      const { data } = response;
      dispatch(updateReceiverBriefStatus(data));
      dispatch(updateBriefsCount(data?.pagination?.total_records));
      dispatch(updateCurrentPage(data?.pagination?.page));
    } catch (error) {
      console.log({ error });
    }
  };
export const getReceiverBrieftStatusSearch =
  (searchQuery, page) => async (dispatch) => {
    try {
      const pageSize = 10;
      const url = `/reviewer/brief_status?search_value=${searchQuery}&page=${page}&page_size=${pageSize}`;
      const response = await client.get(url);
      const { data } = response;
      // dispatch(updateReceiverBriefStatus(data));
      dispatch(updateSearchValues(response?.data));
      dispatch(updateSearchCount(data?.pagination?.total_records));
      dispatch(updateCurrentPage(data?.pagination?.page));
    } catch (error) {
      console.log({ error });
    }
  };

export const calculateDate = (value) => async (dispatch) => {
  try {
    const response = await client.post("/calculate_dates", {
      start_date: value,
    });
    const { data } = response;
    dispatch(updateCalculateDate(data));
    // console.log("calculate_dates", data);
  } catch (error) {
    console.log("data fecthing error", error);
  }
};

export const clearCalculatedDateFromState = () => async (dispatch) => {
  try {
    dispatch(UpdateClearCalculatedDate());
  } catch (error) {
    console.log("Error clearing calculated date:", error);
  }
};

export const getAllocateMember = () => async (dispatch) => {
  try {
    const response = await client.get("/project-coordinators");
    const { data } = response;
    dispatch(updateGetAllocateMember(data));
  } catch (error) {
    console.log(error);
  }
};

export const getAllocateStudy =
  (formData, UserId) => async (dispatch, errorMessage) => {
    const accesstoken = localStorage.getItem("token");
    console.log({ accesstoken });
    try {
      const response = await client.post(
        "/allocate_study",
        {
          brief_id: formData.briefIds,
          allocated_to: formData.studyAllocate,
          allocated_by: UserId,
          // category_type: formData.category,
          // product_type: formData.product,
          // study_type: formData.studyType,
          // brand: formData.brand,
        },
        {
          includeAuthorization: true,
          authorization: `Bearer ${accesstoken}`,
        }
      );
      console.log({ response });
      const { data } = response;
      dispatch(updateAllocateStudy(data));
      dispatch(updateSuccessMessage(data?.statusCode));
      dispatch(updateErrorMessage(data));
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

export const getAllocateBrifId = () => async (dispatch) => {
  try {
    const response = await client.get("/allocate_page");
    const { data } = response;
    dispatch(updateGetllocateBriefId(data));
  } catch (error) {
    console.log(error);
  }
};

export const rejectBriefTrack =
  (briefId, rejectionReason) => async (dispatch) => {
    try {
      const url = `/reject_brief/${briefId}`;
      const response = await client.put(
        url,
        { rejection_reason: rejectionReason },
        {
          includeAuthorization: true,
        }
      );
      const { data } = response;
      dispatch(updateRejectBriefId(data));
      dispatch(updateSuccessMessage(data?.message));
      dispatch(updateErrorMessage(data?.message));
      console.log({ data });
    } catch (error) {
      console.log(error);
    }
  };

export const rejectBriefTrackCreator = (briefId) => async (dispatch) => {
  try {
    const url = `/reject_brief/${briefId}`;
    const response = await client.put(url, {
      includeAuthorization: true,
    });
    const { data } = response;
    dispatch(updateRejectBriefId(data));
    console.log({ data });
  } catch (error) {
    console.log(error);
  }
};

export const briefStatusFileUpload = (newFormData) => async (dispatch) => {
  console.log({ newFormData });
  try {
    const response = await client.post(
      "/upload_file",
      {
        newFormData,
      },
      {
        includeAuthorization: true,
      }
    );
    const { data } = response;
    dispatch(updateUploadFile(data));
    if (data?.statusCode === 200) {
      dispatch(updateSuccessMessage(data?.message));
    } else {
      dispatch(updateErrorMessage(response?.data?.message));
    }
  } catch (error) {
    console.log("data fecthing error", error);
    dispatch(updateErrorMessage(response?.data?.message));
  }
};

export const getSearchValue =
  (search_term, briefStatus, page) => async (dispatch) => {
    const page_size = 10;
    const url = `/search_studyName`;

    const payload = JSON.stringify({
      search_query: search_term,
      briefs_data: briefStatus,
      page: page,
      page_size: page_size,
    });

    try {
      const response = await client.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response?.data?.pagination?.total_records);
      dispatch(updateSearchValues(response?.data));
      dispatch(updateSearchCount(response?.data?.pagination?.total_records));
    } catch (error) {
      console.log("API Error:", error);
    }
  };

export const getCountValue = () => async (dispatch) => {
  try {
    const response = await client.get("/pc_brief_status_counts");
    const { data } = response;
    dispatch(updateCountsValue(data));
  } catch (error) {
    console.log(error);
  }
};

////Study Tracker API's
export const studyTrackerDropDown = () => async (dispatch) => {
  const url = "/get_study_tracker_data";
  try {
    const response = await client.get(url);
    const { data } = response;
    dispatch(UpdatestudyDropDown(data));
  } catch (error) {
    console.log(error);
  }
};

export const studySubmittedActivity = () => async (dispatch) => {
  try {
    const response = await client.get("/get_submitted_activity");
    const { data } = response;
    // console.log({data})
    dispatch(UpdateStudySubmittedActivity(data));
  } catch (error) {
    console.log(error);
  }
};

export const studySubmit = (formData, userId) => async (dispatch) => {
  if (!formData || formData.length === 0) {
    console.log("No data to submit");
    return;
  }

  const payload = formData.map((row) => ({
    brief_id: row.study_id,
    study_name: row.studyName,
    task: row.task,
    track_status: row.status,
    remarks: row.remarks,
    action_date: row.action_date,
    submitted_by: userId,
  }));

  const url = "/study_tracker";
  try {
    const response = await client.post(url, payload);
    const { data } = response;
    console.log({ data });

    dispatch(UpdateStudySubmit(data));

    dispatch(updateSuccessMessage(data?.message));
  } catch (error) {
    console.log("Error submitting data:", error);

    dispatch(
      updateErrorMessage(
        error?.response?.data?.message || "Failed to submit study"
      )
    );
  }
};

export const dashboardCountValues = () => async (dispatch) => {
  try {
    const response = await client.get("/dashboard/brief_status");
    const { data } = response;
    dispatch(updateDashboardCountValues(data));
  } catch (error) {
    console.log(error);
  }
};

export const dashboardBarchartValues = () => async (dispatch) => {
  const url = `/all_briefs_progress`;
  try {
    const response = await client.get(url);
    const { data } = response;
    dispatch(updateDashboardBarchartValues(data));
  } catch (error) {
    console.log(error);
  }
};
export const dashboardBarchartValuesSearch =
  (study_name) => async (dispatch) => {
    const encodedStudy_name = encodeURIComponent(study_name);
    const url = `/all_briefs_progress?study_name=${encodedStudy_name}`;
    try {
      const response = await client.get(url);
      const { data } = response;
      dispatch(updateDashboardBarchartValues(data));
    } catch (error) {
      console.log(error);
    }
  };
export const dashboardTablePast = () => async (dispatch) => {
  try {
    const response = await client.get("/reviewer/past_seven_days");
    const { data } = response;
    dispatch(updateDashboardTablePast(data));
  } catch (error) {
    console.log(error);
  }
};
export const dashboardTableNext = () => async (dispatch) => {
  try {
    const response = await client.get("/reviewer/next_seven_days");
    const { data } = response;
    dispatch(updateDashboardTableNext(data));
  } catch (error) {
    console.log(error);
  }
};

export const dashboardDonutchartValues = (department) => async (dispatch) => {
  const encodedDepartment = encodeURIComponent(department);
  const url = `/department_stats`;

  try {
    const response = await client.get(url);
    const { data } = response;
    dispatch(updateDashboardDonutchartValues(data));
  } catch (error) {
    console.log(error);
  }
};
export const dashboardDonutchartSearchValues = (department) => async (dispatch) => {
  const sanitizedDepartment = department.replace(/\s+/g, ''); 
  const encodedDepartment = encodeURIComponent(sanitizedDepartment);
  const url = `/department_stats?department=${encodedDepartment}`;

  try {
    const response = await client.get(url);
    const { data } = response;
    dispatch(updateDashboardDonutchartValues(data));
  } catch (error) {
    console.log(error);
  }
};
