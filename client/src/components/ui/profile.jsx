import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
    BookOpen,
    Star,
    Trophy,
    Target,
    PlayCircle,
    Users
} from "lucide-react";
import { useContext, useState } from "react";
import { useSelector } from "react-redux";

function Profile() {
    const { auth } = useContext(AuthContext);
    const { studentBoughtCoursesList } = useContext(StudentContext);
    const userProgress = useSelector(store => store.progress)
    const progress = userProgress ? userProgress : 0
    const [activeTab, setActiveTab] = useState('overview');

    console.log(`auth user response:${JSON.stringify(auth)}`)

    // Calculate stats
    const completedCourses = studentBoughtCoursesList?.filter(course => course.progress === 100).length || 0;
    const inProgressCourses = studentBoughtCoursesList?.filter(course => course.progress > 0 && course.progress < 100).length || 0;
    const totalCourses = studentBoughtCoursesList?.length || 0;

    const stats = [
        { icon: Trophy, label: "Completed", value: completedCourses, color: "text-green-600" },
        { icon: PlayCircle, label: "In Progress", value: inProgressCourses, color: "text-blue-600" },
        { icon: BookOpen, label: "Total Courses", value: totalCourses, color: "text-purple-600" },
        { icon: Users, label: "Learning Hours", value: "42h", color: "text-orange-600" }
    ];

    const skills = [
        { name: "React", level: 85 },
        { name: "JavaScript", level: 90 },
        { name: "Node.js", level: 75 },
        { name: "UI/UX", level: 70 }
    ];

    return (
        <div className="min-h-screen  bg-gradient-to-r from-blue-600/10 via-purple-200/10 to-indigo-600/10 border-b border-blue-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-blue-600">My Profile</h1>
                            <p className="text-gray-900 font-medium  mt-2">Welcome back, {auth?.user?.userName}!</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <Card className="text-center p-6">
                            <Avatar className="w-20 h-20 mx-auto mb-4">
                                <AvatarImage src={auth?.user?.avatar} />
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl">
                                    {auth?.user?.userName?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <h2 className="font-bold text-lg">{auth?.user?.userName}</h2>

                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white mb-4">
                                <Star className="w-3 h-3 mr-1" />
                                Premium Learner
                            </Badge>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-900">Member since</span>
                                    <span className="font-normal">{auth.user.joinedDateFormatted}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Courses</span>
                                    <span className="font-semibold">{totalCourses}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Quick Stats */}
                        <Card className="p-6">
                            <CardTitle className="text-lg mb-4">Learning Stats</CardTitle>
                            <div className="space-y-4">
                                {stats.map((stat, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                                            <stat.icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm text-gray-600">{stat.label}</div>
                                            <div className="font-semibold">{stat.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Tabs */}
                        <Card className="p-2 mb-6">
                            <div className="flex space-x-1">
                                {['overview', 'courses', 'achievements', 'skills'].map((tab) => (
                                    <Button
                                        key={tab}
                                        variant={activeTab === tab ? "default" : "ghost"}
                                        className={`flex-1 capitalize ${activeTab === tab ? 'bg-blue-600' : ''}`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab}
                                    </Button>
                                ))}
                            </div>
                        </Card>

                        {/* Tab Content */}
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Recent Courses */}
                                <Card className="p-6">
                                    <CardTitle className="flex items-center gap-2 mb-4">
                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                        Recent Courses
                                    </CardTitle>
                                    <div className="space-y-4">
                                        {studentBoughtCoursesList?.slice(0, 3).map((course) => (
                                            <div key={course.courseId} className="flex items-center gap-3 p-3 border rounded-lg">
                                                <img src={course.courseImage} alt={course.title} className="w-12 h-12 rounded-lg" />
                                                <div className="flex-1">
                                                    <div className="font-medium text-sm">{course.title}</div>
                                                    <Progress value={progress} className="h-2 mt-2" />
                                                </div>
                                                <span className="text-sm font-semibold">{progress}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                {/* Skills */}
                                <Card className="p-6">
                                    <CardTitle className="flex items-center gap-2 mb-4">
                                        <Target className="w-5 h-5 text-green-600" />
                                        Skills Progress
                                    </CardTitle>
                                    <div className="space-y-4">
                                        {skills.map((skill, index) => (
                                            <div key={index}>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span>{skill.name}</span>
                                                    <span>{skill.level}%</span>
                                                </div>
                                                <Progress value={skill.level} />
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'courses' && (
                            <Card className="p-6">
                                <CardTitle className="mb-4">My Courses ({totalCourses})</CardTitle>
                                <div className="space-y-4">
                                    {studentBoughtCoursesList?.map((course) => (
                                        <div key={course.courseId} className="flex items-center gap-4 p-4 border rounded-lg">
                                            <img src={course.courseImage} alt={course.title} className="w-16 h-16 rounded-lg" />
                                            <div className="flex-1">
                                                <div className="font-semibold">{course.title}</div>
                                                <div className="text-sm text-gray-600">{course.instructorName}</div>
                                                <Progress value={progress} className="h-2 mt-2" />
                                            </div>
                                            <Button size="sm">
                                                {course.progress === 100 ? 'Review' : 'Continue'}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {activeTab === 'achievements' && (
                            <Card className="p-6">
                                <CardTitle className="mb-4">Achievements</CardTitle>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { name: "Fast Learner", icon: "🚀", desc: "Complete 3 courses" },
                                        { name: "Quiz Master", icon: "🧠", desc: "Score 100% on quizzes" },
                                        { name: "Early Bird", icon: "🌅", desc: "Finish course quickly" },
                                        { name: "Dedicated", icon: "⭐", desc: "30 days streak" }
                                    ].map((ach, index) => (
                                        <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                                            <div className="text-2xl">{ach.icon}</div>
                                            <div>
                                                <div className="font-semibold">{ach.name}</div>
                                                <div className="text-sm text-gray-600">{ach.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {activeTab === 'skills' && (
                            <Card className="p-6">
                                <CardTitle className="mb-4">Skills Development</CardTitle>
                                <div className="space-y-6">
                                    {skills.map((skill, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between mb-2">
                                                <span className="font-semibold">{skill.name}</span>
                                                <span className="text-blue-600 font-semibold">{skill.level}%</span>
                                            </div>
                                            <Progress value={skill.level} />
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;