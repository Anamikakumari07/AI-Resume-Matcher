function Features() {
  return (
    <section className="py-16 bg-white">

      <h2 className="text-4xl font-bold text-center mb-10">
        Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-5">

        <div className="shadow-lg rounded-xl p-6">
          <h3 className="text-xl font-bold">
            Resume Upload
          </h3>

          <p className="mt-3 text-gray-600">
            Upload PDF or DOCX resumes.
          </p>
        </div>

        <div className="shadow-lg rounded-xl p-6">
          <h3 className="text-xl font-bold">
            ATS Score
          </h3>

          <p className="mt-3 text-gray-600">
            Check ATS score instantly.
          </p>
        </div>

        <div className="shadow-lg rounded-xl p-6">
          <h3 className="text-xl font-bold">
            AI Suggestions
          </h3>

          <p className="mt-3 text-gray-600">
            Improve your resume using AI.
          </p>
        </div>

      </div>

    </section>
  );
}

export default Features;