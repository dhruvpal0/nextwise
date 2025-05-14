import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { Navigate, useParams } from "react-router-dom"

const PurchaseCourseProtectedRoute = ( {children})=> {
    const {courseId} = useParams();
    const {data, isLoading} = useGetCourseDetailWithStatusQuery(courseId); // ✅ pass courseId
    
    if (isLoading) return <p>Loading...</p>
    
    if (!courseId) return <Navigate to="/" />;

    return data?.purchased ? children : <Navigate to={`/course-details/${courseId}`} />
}

export default PurchaseCourseProtectedRoute;

