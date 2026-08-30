import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import API from "../services/api";

import toast from "react-hot-toast";

import Layout from "../components/Layout";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import {
    Bar,
    Doughnut,
} from "react-chartjs-2";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);


function AdminDashboard() {

    // =====================================================
    // STATISTICS
    // =====================================================

    const [stats, setStats] = useState({

        totalUsers: 0,

        totalResumes: 0,

        totalJobs: 0,

        totalApplications: 0,

        averageATS: 0,

    });


    // =====================================================
    // DATA
    // =====================================================

    const [users, setUsers] =
        useState([]);

    const [resumes, setResumes] =
        useState([]);

    const [jobs, setJobs] =
        useState([]);

    const [applications, setApplications] =
        useState([]);


    // =====================================================
    // SEARCH
    // =====================================================

    const [searchUser, setSearchUser] =
        useState("");

    const [searchResume, setSearchResume] =
        useState("");

    const [searchJob, setSearchJob] =
        useState("");

    const [searchApplication, setSearchApplication] =
        useState("");


    // =====================================================
    // LOADING
    // =====================================================

    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState(null);


    // =====================================================
    // JOB FORM
    // =====================================================

    const [showJobForm, setShowJobForm] =
        useState(false);

    const [editingJobId, setEditingJobId] =
        useState(null);

    const [jobForm, setJobForm] =
        useState({

            title: "",

            company: "",

            location: "",

            description: "",

            skills: "",

            requirements: "",

            salary: "",

            type: "",

            applyUrl: "",

        });


    // =====================================================
    // PREVENT DUPLICATE INITIAL REQUEST
    // =====================================================

    const hasFetched =
        useRef(false);


    // =====================================================
    // FETCH ALL ADMIN DATA
    // =====================================================

    useEffect(() => {

        if (hasFetched.current) {
            return;
        }


        hasFetched.current = true;


        fetchData();

    }, []);


    // =====================================================
    // FETCH DATA
    // =====================================================

    const fetchData = async () => {

        try {

            setLoading(true);


            const [
                statsRes,
                usersRes,
                resumesRes,
                jobsRes,
                applicationsRes,
            ] = await Promise.all([

                API.get(
                    "/admin/stats"
                ),

                API.get(
                    "/admin/users"
                ),

                API.get(
                    "/admin/resumes"
                ),

                API.get(
                    "/admin/jobs"
                ),

                API.get(
                    "/admin/applications"
                ),

            ]);


            console.log(
                "Admin Stats:",
                statsRes.data
            );

            console.log(
                "Admin Users:",
                usersRes.data
            );

            console.log(
                "Admin Resumes:",
                resumesRes.data
            );

            console.log(
                "Admin Jobs:",
                jobsRes.data
            );

            console.log(
                "Admin Applications:",
                applicationsRes.data
            );


            setStats({

                totalUsers:
                    Number(
                        statsRes.data?.stats?.totalUsers
                    ) || 0,

                totalResumes:
                    Number(
                        statsRes.data?.stats?.totalResumes
                    ) || 0,

                totalJobs:
                    Number(
                        statsRes.data?.stats?.totalJobs
                    ) || 0,

                totalApplications:
                    Number(
                        statsRes.data?.stats?.totalApplications
                    ) || 0,

                averageATS:
                    Number(
                        statsRes.data?.stats?.averageATS
                    ) || 0,

            });


            setUsers(

                Array.isArray(
                    usersRes.data?.users
                )
                    ? usersRes.data.users
                    : []

            );


            setResumes(

                Array.isArray(
                    resumesRes.data?.resumes
                )
                    ? resumesRes.data.resumes
                    : []

            );


            setJobs(

                Array.isArray(
                    jobsRes.data?.jobs
                )
                    ? jobsRes.data.jobs
                    : []

            );


            setApplications(

                Array.isArray(
                    applicationsRes.data?.applications
                )
                    ? applicationsRes.data.applications
                    : []

            );


        } catch (error) {

            console.log(
                "Admin Dashboard Error:",
                error
            );


            const message =
                error.response?.data?.message ||
                "Unable to load admin data.";


            toast.error(
                message
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // DELETE USER
    // =====================================================

    const deleteUser = async (
        id
    ) => {

        if (
            !window.confirm(
                "Delete this user? Their resumes and applications will also be deleted."
            )
        ) {

            return;

        }


        try {

            setActionLoading(
                `user-${id}`
            );


            await API.delete(
                `/admin/user/${id}`
            );


            setUsers(
                previous =>
                    previous.filter(
                        user =>
                            user._id !== id
                    )
            );


            toast.success(
                "User deleted successfully."
            );


            await refreshStats();


        } catch (error) {

            console.log(
                "Delete User Error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Unable to delete user."
            );


        } finally {

            setActionLoading(
                null
            );

        }

    };


    // =====================================================
    // DELETE RESUME
    // =====================================================

    const deleteResume = async (
        id
    ) => {

        if (
            !window.confirm(
                "Delete this resume?"
            )
        ) {

            return;

        }


        try {

            setActionLoading(
                `resume-${id}`
            );


            await API.delete(
                `/admin/resume/${id}`
            );


            setResumes(
                previous =>
                    previous.filter(
                        resume =>
                            resume._id !== id
                    )
            );


            toast.success(
                "Resume deleted successfully."
            );


            await refreshStats();


        } catch (error) {

            console.log(
                "Delete Resume Error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Unable to delete resume."
            );


        } finally {

            setActionLoading(
                null
            );

        }

    };


    // =====================================================
    // JOB FORM CHANGE
    // =====================================================

    const handleJobChange = (
        e
    ) => {

        const {
            name,
            value,
        } = e.target;


        setJobForm(
            previous => ({

                ...previous,

                [name]:
                    value,

            })
        );

    };


    // =====================================================
    // RESET JOB FORM
    // =====================================================

    const resetJobForm = () => {

        setJobForm({

            title: "",

            company: "",

            location: "",

            description: "",

            skills: "",

            requirements: "",

            salary: "",

            type: "",

            applyUrl: "",

        });


        setEditingJobId(
            null
        );

        setShowJobForm(
            false
        );

    };


    // =====================================================
    // EDIT JOB
    // =====================================================

    const startEditJob = (
        job
    ) => {

        setEditingJobId(
            job._id
        );


        setJobForm({

            title:
                job.title || "",

            company:
                job.company || "",

            location:
                job.location || "",

            description:
                job.description || "",

            skills:
                Array.isArray(
                    job.skills
                )
                    ? job.skills.join(
                        ", "
                    )
                    : job.skills || "",

            requirements:
                Array.isArray(
                    job.requirements
                )
                    ? job.requirements.join(
                        ", "
                    )
                    : job.requirements || "",

            salary:
                job.salary || "",

            type:
                job.type || "",

            applyUrl:
                job.applyUrl || "",

        });


        setShowJobForm(
            true
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    // =====================================================
    // CREATE / UPDATE JOB
    // =====================================================

    const saveJob = async (
        e
    ) => {

        e.preventDefault();


        if (
            !jobForm.title.trim()
        ) {

            toast.error(
                "Job title is required."
            );

            return;

        }


        if (
            !jobForm.company.trim()
        ) {

            toast.error(
                "Company is required."
            );

            return;

        }


        try {

            setActionLoading(
                editingJobId
                    ? `edit-job-${editingJobId}`
                    : "create-job"
            );


            const payload = {

                title:
                    jobForm.title.trim(),

                company:
                    jobForm.company.trim(),

                location:
                    jobForm.location.trim(),

                description:
                    jobForm.description.trim(),

                skills:
                    jobForm.skills,

                requirements:
                    jobForm.requirements.trim(),

                salary:
                    jobForm.salary.trim(),

                type:
                    jobForm.type.trim(),

                applyUrl:
                    jobForm.applyUrl.trim(),

            };


            let response;


            if (
                editingJobId
            ) {

                response =
                    await API.put(

                        `/admin/job/${editingJobId}`,

                        payload

                    );


                setJobs(
                    previous =>
                        previous.map(
                            job =>

                                job._id ===
                                editingJobId

                                    ? response.data.job

                                    : job
                        )
                );


                toast.success(
                    "Job updated successfully."
                );


            } else {

                response =
                    await API.post(

                        "/admin/job",

                        payload

                    );


                setJobs(
                    previous => [

                        response.data.job,

                        ...previous,

                    ]
                );


                toast.success(
                    "Job created successfully."
                );

            }


            resetJobForm();


            await refreshStats();


        } catch (error) {

            console.log(
                "Save Job Error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Unable to save job."
            );


        } finally {

            setActionLoading(
                null
            );

        }

    };


    // =====================================================
    // DELETE JOB
    // =====================================================

    const deleteJob = async (
        id
    ) => {

        if (
            !window.confirm(
                "Delete this job?"
            )
        ) {

            return;

        }


        try {

            setActionLoading(
                `job-${id}`
            );


            await API.delete(
                `/admin/job/${id}`
            );


            setJobs(
                previous =>
                    previous.filter(
                        job =>
                            job._id !== id
                    )
            );


            toast.success(
                "Job deleted successfully."
            );


            await refreshStats();


        } catch (error) {

            console.log(
                "Delete Job Error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Unable to delete job."
            );


        } finally {

            setActionLoading(
                null
            );

        }

    };


    // =====================================================
    // UPDATE APPLICATION STATUS
    // =====================================================

    const updateApplicationStatus =
        async (
            id,
            status
        ) => {

            try {

                setActionLoading(
                    `application-${id}`
                );


                const response =
                    await API.put(

                        `/admin/application/${id}/status`,

                        {
                            status,
                        }

                    );


                setApplications(
                    previous =>
                        previous.map(
                            application =>

                                application._id ===
                                id

                                    ? {
                                        ...application,
                                        status:
                                            response.data
                                                ?.application
                                                ?.status ||
                                            status,
                                    }

                                    : application
                        )
                );


                toast.success(
                    "Application status updated."
                );


                await refreshStats();


            } catch (error) {

                console.log(
                    "Update Application Status Error:",
                    error
                );


                toast.error(
                    error.response?.data?.message ||
                    "Unable to update application status."
                );


            } finally {

                setActionLoading(
                    null
                );

            }

        };


    // =====================================================
    // DELETE APPLICATION
    // =====================================================

    const deleteApplication = async (
        id
    ) => {

        if (
            !window.confirm(
                "Delete this application?"
            )
        ) {

            return;

        }


        try {

            setActionLoading(
                `application-delete-${id}`
            );


            await API.delete(
                `/admin/application/${id}`
            );


            setApplications(
                previous =>
                    previous.filter(
                        application =>
                            application._id !== id
                    )
            );


            toast.success(
                "Application deleted."
            );


            await refreshStats();


        } catch (error) {

            console.log(
                "Delete Application Error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Unable to delete application."
            );


        } finally {

            setActionLoading(
                null
            );

        }

    };


    // =====================================================
    // REFRESH STATISTICS
    // =====================================================

    const refreshStats = async () => {

        try {

            const response =
                await API.get(
                    "/admin/stats"
                );


            if (
                response.data?.stats
            ) {

                setStats({

                    totalUsers:
                        Number(
                            response.data.stats.totalUsers
                        ) || 0,

                    totalResumes:
                        Number(
                            response.data.stats.totalResumes
                        ) || 0,

                    totalJobs:
                        Number(
                            response.data.stats.totalJobs
                        ) || 0,

                    totalApplications:
                        Number(
                            response.data.stats.totalApplications
                        ) || 0,

                    averageATS:
                        Number(
                            response.data.stats.averageATS
                        ) || 0,

                });

            }

        } catch (error) {

            console.log(
                "Refresh Stats Error:",
                error
            );

        }

    };


    // =====================================================
    // FILTER USERS
    // =====================================================

    const filteredUsers =
        useMemo(() => {

            const search =
                searchUser
                    .toLowerCase()
                    .trim();


            return users.filter(
                user => {

                    const name =
                        String(
                            user.name || ""
                        ).toLowerCase();


                    const email =
                        String(
                            user.email || ""
                        ).toLowerCase();


                    return (

                        name.includes(
                            search
                        ) ||

                        email.includes(
                            search
                        )

                    );

                }
            );

        }, [
            users,
            searchUser,
        ]);


    // =====================================================
    // FILTER RESUMES
    // =====================================================

    const filteredResumes =
        useMemo(() => {

            const search =
                searchResume
                    .toLowerCase()
                    .trim();


            return resumes.filter(
                resume => {

                    const filename =
                        String(
                            resume.filename || ""
                        ).toLowerCase();


                    const userName =
                        String(
                            resume.user?.name || ""
                        ).toLowerCase();


                    return (

                        filename.includes(
                            search
                        ) ||

                        userName.includes(
                            search
                        )

                    );

                }
            );

        }, [
            resumes,
            searchResume,
        ]);


    // =====================================================
    // FILTER JOBS
    // =====================================================

    const filteredJobs =
        useMemo(() => {

            const search =
                searchJob
                    .toLowerCase()
                    .trim();


            return jobs.filter(
                job => {

                    const title =
                        String(
                            job.title || ""
                        ).toLowerCase();


                    const company =
                        String(
                            job.company || ""
                        ).toLowerCase();


                    const location =
                        String(
                            job.location || ""
                        ).toLowerCase();


                    return (

                        title.includes(
                            search
                        ) ||

                        company.includes(
                            search
                        ) ||

                        location.includes(
                            search
                        )

                    );

                }
            );

        }, [
            jobs,
            searchJob,
        ]);


    // =====================================================
    // FILTER APPLICATIONS
    // =====================================================

    const filteredApplications =
        useMemo(() => {

            const search =
                searchApplication
                    .toLowerCase()
                    .trim();


            return applications.filter(
                application => {

                    const userName =
                        String(
                            application.user?.name ||
                            ""
                        ).toLowerCase();


                    const userEmail =
                        String(
                            application.user?.email ||
                            ""
                        ).toLowerCase();


                    const company =
                        String(
                            application.company ||
                            ""
                        ).toLowerCase();


                    const position =
                        String(
                            application.position ||
                            ""
                        ).toLowerCase();


                    const status =
                        String(
                            application.status ||
                            ""
                        ).toLowerCase();


                    return (

                        userName.includes(
                            search
                        ) ||

                        userEmail.includes(
                            search
                        ) ||

                        company.includes(
                            search
                        ) ||

                        position.includes(
                            search
                        ) ||

                        status.includes(
                            search
                        )

                    );

                }
            );

        }, [
            applications,
            searchApplication,
        ]);


    // =====================================================
    // CHART DATA
    // =====================================================

    const barData = {

        labels: [

            "Users",

            "Resumes",

            "Jobs",

            "Applications",

        ],

        datasets: [

            {

                label:
                    "Platform Data",

                data: [

                    stats.totalUsers,

                    stats.totalResumes,

                    stats.totalJobs,

                    stats.totalApplications,

                ],

            },

        ],

    };


    const averageATS =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    stats.averageATS
                ) || 0
            )
        );


    const doughnutData = {

        labels: [

            "Average ATS",

            "Remaining",

        ],

        datasets: [

            {

                data: [

                    averageATS,

                    100 -
                        averageATS,

                ],

            },

        ],

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Layout>

                <div className="min-h-[60vh] flex items-center justify-center">

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center w-full max-w-md">

                        <div className="text-5xl mb-4">
                            🛡️
                        </div>


                        <h2 className="text-xl font-semibold text-gray-700">
                            Loading Admin Dashboard...
                        </h2>


                        <p className="text-gray-500 mt-2">
                            Fetching users, resumes, jobs and applications.
                        </p>

                    </div>

                </div>

            </Layout>

        );

    }


    return (

        <Layout>

            <div className="max-w-7xl mx-auto">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-8">

                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                        Administration
                    </p>


                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-1">
                        Admin Dashboard
                    </h1>


                    <p className="text-gray-500 mt-3">
                        Manage users, resumes, jobs and applications.
                    </p>

                </div>


                {/* =================================================
                    STAT CARDS
                ================================================= */}

                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">

                    {/* USERS */}

                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

                        <p className="text-sm text-gray-500">
                            Total Users
                        </p>


                        <h2 className="text-3xl font-bold text-gray-800 mt-2">
                            {stats.totalUsers}
                        </h2>


                        <div className="text-2xl mt-4">
                            👥
                        </div>

                    </div>


                    {/* RESUMES */}

                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

                        <p className="text-sm text-gray-500">
                            Total Resumes
                        </p>


                        <h2 className="text-3xl font-bold text-blue-600 mt-2">
                            {stats.totalResumes}
                        </h2>


                        <div className="text-2xl mt-4">
                            📄
                        </div>

                    </div>


                    {/* JOBS */}

                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

                        <p className="text-sm text-gray-500">
                            Total Jobs
                        </p>


                        <h2 className="text-3xl font-bold text-green-600 mt-2">
                            {stats.totalJobs}
                        </h2>


                        <div className="text-2xl mt-4">
                            💼
                        </div>

                    </div>


                    {/* APPLICATIONS */}

                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

                        <p className="text-sm text-gray-500">
                            Applications
                        </p>


                        <h2 className="text-3xl font-bold text-purple-600 mt-2">
                            {stats.totalApplications}
                        </h2>


                        <div className="text-2xl mt-4">
                            📤
                        </div>

                    </div>


                    {/* ATS */}

                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

                        <p className="text-sm text-gray-500">
                            Average ATS
                        </p>


                        <h2 className="text-3xl font-bold text-orange-600 mt-2">
                            {averageATS}%
                        </h2>


                        <div className="text-2xl mt-4">
                            📊
                        </div>

                    </div>

                </div>


                {/* =================================================
                    CHARTS
                ================================================= */}

                <div className="grid lg:grid-cols-2 gap-6 mt-8">

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                        <h2 className="text-xl font-bold text-gray-800 mb-5">
                            Platform Overview
                        </h2>


                        <Bar
                            data={
                                barData
                            }
                        />

                    </div>


                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                        <h2 className="text-xl font-bold text-gray-800 mb-5">
                            Average ATS
                        </h2>


                        <div className="max-w-xs mx-auto">

                            <Doughnut
                                data={
                                    doughnutData
                                }
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    JOB MANAGEMENT
                ================================================= */}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-8">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>

                            <h2 className="text-2xl font-bold text-gray-800">
                                Job Management
                            </h2>


                            <p className="text-gray-500 mt-1">
                                Create, edit and delete jobs available to users.
                            </p>

                        </div>


                        <button
                            onClick={() => {

                                if (
                                    showJobForm &&
                                    !editingJobId
                                ) {

                                    resetJobForm();

                                } else {

                                    setEditingJobId(
                                        null
                                    );

                                    setJobForm({

                                        title: "",

                                        company: "",

                                        location: "",

                                        description: "",

                                        skills: "",

                                        requirements: "",

                                        salary: "",

                                        type: "",

                                        applyUrl: "",

                                    });

                                    setShowJobForm(
                                        true
                                    );

                                }

                            }}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            {showJobForm &&
                            !editingJobId
                                ? "Cancel"
                                : "+ Add Job"}
                        </button>

                    </div>


                    {/* =================================================
                        JOB FORM
                    ================================================= */}

                    {showJobForm && (

                        <form
                            onSubmit={
                                saveJob
                            }
                            className="mt-6 bg-gray-50 border border-gray-100 rounded-xl p-6"
                        >

                            <h3 className="text-lg font-bold text-gray-800 mb-5">

                                {editingJobId
                                    ? "Edit Job"
                                    : "Add New Job"}

                            </h3>


                            <div className="grid md:grid-cols-2 gap-4">

                                <input
                                    name="title"
                                    value={
                                        jobForm.title
                                    }
                                    onChange={
                                        handleJobChange
                                    }
                                    placeholder="Job Title"
                                    className="border border-gray-300 rounded-lg p-3"
                                />


                                <input
                                    name="company"
                                    value={
                                        jobForm.company
                                    }
                                    onChange={
                                        handleJobChange
                                    }
                                    placeholder="Company"
                                    className="border border-gray-300 rounded-lg p-3"
                                />


                                <input
                                    name="location"
                                    value={
                                        jobForm.location
                                    }
                                    onChange={
                                        handleJobChange
                                    }
                                    placeholder="Location"
                                    className="border border-gray-300 rounded-lg p-3"
                                />


                                <input
                                    name="salary"
                                    value={
                                        jobForm.salary
                                    }
                                    onChange={
                                        handleJobChange
                                    }
                                    placeholder="Salary"
                                    className="border border-gray-300 rounded-lg p-3"
                                />


                                <input
                                    name="type"
                                    value={
                                        jobForm.type
                                    }
                                    onChange={
                                        handleJobChange
                                    }
                                    placeholder="Job Type"
                                    className="border border-gray-300 rounded-lg p-3"
                                />


                                <input
                                    name="applyUrl"
                                    value={
                                        jobForm.applyUrl
                                    }
                                    onChange={
                                        handleJobChange
                                    }
                                    placeholder="Application URL"
                                    className="border border-gray-300 rounded-lg p-3"
                                />

                            </div>


                            <textarea
                                name="skills"
                                value={
                                    jobForm.skills
                                }
                                onChange={
                                    handleJobChange
                                }
                                placeholder="Skills (comma separated)"
                                rows="3"
                                className="w-full border border-gray-300 rounded-lg p-3 mt-4"
                            />


                            <textarea
                                name="requirements"
                                value={
                                    jobForm.requirements
                                }
                                onChange={
                                    handleJobChange
                                }
                                placeholder="Requirements"
                                rows="3"
                                className="w-full border border-gray-300 rounded-lg p-3 mt-4"
                            />


                            <textarea
                                name="description"
                                value={
                                    jobForm.description
                                }
                                onChange={
                                    handleJobChange
                                }
                                placeholder="Job Description"
                                rows="5"
                                className="w-full border border-gray-300 rounded-lg p-3 mt-4"
                            />


                            <div className="flex gap-3 mt-5">

                                <button
                                    type="submit"
                                    disabled={
                                        actionLoading ===
                                        (
                                            editingJobId
                                                ? `edit-job-${editingJobId}`
                                                : "create-job"
                                        )
                                    }
                                    className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition"
                                >

                                    {actionLoading ===
                                    (
                                        editingJobId
                                            ? `edit-job-${editingJobId}`
                                            : "create-job"
                                    )
                                        ? "Saving..."
                                        : editingJobId
                                        ? "Update Job"
                                        : "Create Job"}

                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        resetJobForm
                                    }
                                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    )}


                    {/* =================================================
                        SEARCH JOBS
                    ================================================= */}

                    <div className="mt-6">

                        <input
                            type="text"
                            placeholder="Search jobs by title, company or location..."
                            value={
                                searchJob
                            }
                            onChange={
                                (e) =>
                                    setSearchJob(
                                        e.target.value
                                    )
                            }
                            className="w-full border border-gray-300 rounded-lg p-3"
                        />

                    </div>


                    {/* =================================================
                        JOB LIST
                    ================================================= */}

                    <div className="space-y-4 mt-5">

                        {filteredJobs.length === 0 ? (

                            <div className="bg-gray-50 rounded-xl p-8 text-center">

                                <p className="text-gray-500">
                                    No jobs found.
                                </p>

                            </div>

                        ) : (

                            filteredJobs.map(
                                job => (

                                    <div
                                        key={
                                            job._id
                                        }
                                        className="border border-gray-100 rounded-xl p-5"
                                    >

                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                                            <div>

                                                <h3 className="text-xl font-bold text-gray-800">
                                                    {job.title}
                                                </h3>


                                                <p className="text-blue-600 font-semibold mt-1">
                                                    {job.company}
                                                </p>


                                                {job.location && (

                                                    <p className="text-gray-500 mt-1">
                                                        📍 {job.location}
                                                    </p>

                                                )}

                                            </div>


                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() =>
                                                        startEditJob(
                                                            job
                                                        )
                                                    }
                                                    className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100"
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        deleteJob(
                                                            job._id
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading ===
                                                        `job-${job._id}`
                                                    }
                                                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50"
                                                >

                                                    {actionLoading ===
                                                    `job-${job._id}`
                                                        ? "Deleting..."
                                                        : "Delete"}

                                                </button>

                                            </div>

                                        </div>


                                        {job.skills?.length > 0 && (

                                            <div className="flex flex-wrap gap-2 mt-4">

                                                {job.skills.map(
                                                    (
                                                        skill,
                                                        index
                                                    ) => (

                                                        <span
                                                            key={
                                                                index
                                                            }
                                                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                                                        >
                                                            {skill}
                                                        </span>

                                                    )
                                                )}

                                            </div>

                                        )}

                                    </div>

                                )
                            )

                        )}

                    </div>

                </div>


                {/* =================================================
                    APPLICATION MANAGEMENT
                ================================================= */}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-8">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

                        <div>

                            <h2 className="text-2xl font-bold text-gray-800">
                                Application Management
                            </h2>


                            <p className="text-gray-500 mt-1">
                                Review applications and update their status.
                            </p>

                        </div>


                        <span className="bg-purple-50 text-purple-700 border border-purple-100 px-4 py-2 rounded-lg font-semibold">
                            {applications.length} Applications
                        </span>

                    </div>


                    <input
                        type="text"
                        placeholder="Search applications..."
                        value={
                            searchApplication
                        }
                        onChange={
                            (e) =>
                                setSearchApplication(
                                    e.target.value
                                )
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 mb-5"
                    />


                    {filteredApplications.length === 0 ? (

                        <div className="bg-gray-50 rounded-xl p-8 text-center">

                            <div className="text-4xl mb-3">
                                📭
                            </div>


                            <p className="text-gray-500">
                                No applications found.
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-4">

                            {filteredApplications.map(
                                application => (

                                    <div
                                        key={
                                            application._id
                                        }
                                        className="border border-gray-100 rounded-xl p-5"
                                    >

                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                                            <div>

                                                <h3 className="text-xl font-bold text-gray-800">
                                                    {
                                                        application.position
                                                    }
                                                </h3>


                                                <p className="text-blue-600 font-semibold mt-1">
                                                    {
                                                        application.company
                                                    }
                                                </p>


                                                <p className="text-gray-500 mt-2">
                                                    Applicant:{" "}

                                                    {
                                                        application.user?.name ||
                                                        "Unknown User"
                                                    }

                                                </p>


                                                {application.user?.email && (

                                                    <p className="text-gray-500">
                                                        {
                                                            application.user.email
                                                        }
                                                    </p>

                                                )}

                                            </div>


                                            {/* STATUS */}

                                            <select
                                                value={
                                                    application.status ||
                                                    "Applied"
                                                }
                                                disabled={
                                                    actionLoading ===
                                                    `application-${application._id}`
                                                }
                                                onChange={
                                                    (e) =>
                                                        updateApplicationStatus(

                                                            application._id,

                                                            e.target.value

                                                        )
                                                }
                                                className="border border-gray-300 rounded-lg px-4 py-2"
                                            >

                                                <option value="Applied">
                                                    Applied
                                                </option>

                                                <option value="Interview">
                                                    Interview
                                                </option>

                                                <option value="Rejected">
                                                    Rejected
                                                </option>

                                                <option value="Selected">
                                                    Selected
                                                </option>

                                            </select>

                                        </div>


                                        <div className="grid sm:grid-cols-3 gap-3 mt-5">

                                            <div className="bg-gray-50 rounded-lg p-3">

                                                <p className="text-xs text-gray-400">
                                                    Location
                                                </p>


                                                <p className="font-medium text-gray-700 mt-1">
                                                    {
                                                        application.location ||
                                                        "Not specified"
                                                    }
                                                </p>

                                            </div>


                                            <div className="bg-gray-50 rounded-lg p-3">

                                                <p className="text-xs text-gray-400">
                                                    Job Type
                                                </p>


                                                <p className="font-medium text-gray-700 mt-1">
                                                    {
                                                        application.jobType ||
                                                        "Not specified"
                                                    }
                                                </p>

                                            </div>


                                            <div className="bg-gray-50 rounded-lg p-3">

                                                <p className="text-xs text-gray-400">
                                                    Applied On
                                                </p>


                                                <p className="font-medium text-gray-700 mt-1">

                                                    {application.appliedAt

                                                        ? new Date(
                                                            application.appliedAt
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )

                                                        : application.createdAt

                                                        ? new Date(
                                                            application.createdAt
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )

                                                        : "Recently"}

                                                </p>

                                            </div>

                                        </div>


                                        <div className="mt-4">

                                            <button
                                                onClick={() =>
                                                    deleteApplication(
                                                        application._id
                                                    )
                                                }
                                                disabled={
                                                    actionLoading ===
                                                    `application-delete-${application._id}`
                                                }
                                                className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50"
                                            >

                                                {actionLoading ===
                                                `application-delete-${application._id}`
                                                    ? "Deleting..."
                                                    : "🗑️ Delete Application"}

                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* =================================================
                    USERS
                ================================================= */}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-8">

                    <h2 className="text-2xl font-bold text-gray-800">
                        Users
                    </h2>


                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={
                            searchUser
                        }
                        onChange={
                            (e) =>
                                setSearchUser(
                                    e.target.value
                                )
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 mt-4 mb-5"
                    />


                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="p-3">
                                        Name
                                    </th>

                                    <th className="p-3">
                                        Email
                                    </th>

                                    <th className="p-3">
                                        Role
                                    </th>

                                    <th className="p-3">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredUsers.map(
                                    user => (

                                        <tr
                                            key={
                                                user._id
                                            }
                                            className="border-t"
                                        >

                                            <td className="p-3">
                                                {
                                                    user.name
                                                }
                                            </td>


                                            <td className="p-3">
                                                {
                                                    user.email
                                                }
                                            </td>


                                            <td className="p-3">
                                                {
                                                    user.role ||
                                                    "user"
                                                }
                                            </td>


                                            <td className="p-3">

                                                <button
                                                    onClick={() =>
                                                        deleteUser(
                                                            user._id
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading ===
                                                        `user-${user._id}`
                                                    }
                                                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50"
                                                >

                                                    {actionLoading ===
                                                    `user-${user._id}`
                                                        ? "Deleting..."
                                                        : "Delete"}

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* =================================================
                    RESUMES
                ================================================= */}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-8 mb-10">

                    <h2 className="text-2xl font-bold text-gray-800">
                        Resume History
                    </h2>


                    <input
                        type="text"
                        placeholder="Search resumes by filename or user..."
                        value={
                            searchResume
                        }
                        onChange={
                            (e) =>
                                setSearchResume(
                                    e.target.value
                                )
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 mt-4 mb-5"
                    />


                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="p-3">
                                        Filename
                                    </th>

                                    <th className="p-3">
                                        ATS
                                    </th>

                                    <th className="p-3">
                                        User
                                    </th>

                                    <th className="p-3">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredResumes.map(
                                    resume => (

                                        <tr
                                            key={
                                                resume._id
                                            }
                                            className="border-t"
                                        >

                                            <td className="p-3">
                                                {
                                                    resume.filename
                                                }
                                            </td>


                                            <td className="p-3 font-semibold">
                                                {Number(
                                                    resume.atsScore
                                                ) || 0}
                                                %
                                            </td>


                                            <td className="p-3">
                                                {
                                                    resume.user?.name ||
                                                    "Unknown"
                                                }
                                            </td>


                                            <td className="p-3">

                                                <button
                                                    onClick={() =>
                                                        deleteResume(
                                                            resume._id
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading ===
                                                        `resume-${resume._id}`
                                                    }
                                                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50"
                                                >

                                                    {actionLoading ===
                                                    `resume-${resume._id}`
                                                        ? "Deleting..."
                                                        : "Delete"}

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </Layout>

    );

}

export default AdminDashboard;