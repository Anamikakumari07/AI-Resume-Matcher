function SkeletonCard() {

    return (

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">

            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-5"></div>

            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-3"></div>

            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-3"></div>

            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>

        </div>

    );

}

export default SkeletonCard;