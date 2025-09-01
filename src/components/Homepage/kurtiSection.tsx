// components/InstantSareeSection.js

export default function KurtiSection() {
    return (
        <section className="bg-pink-50 py-12 px-6 md:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Image grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    {/* Video Section */}
                    <div className="w-full">
                        <video autoPlay muted loop className="w-full h-auto rounded-md">
                            <source src="/video/video-2.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    {/* Image Section */}
                    <div className="flex flex-col gap-4">
                        {/* Top Image */}
                        <img
                            src="/img/img-1.jpeg"
                            alt="Draping Step 1"
                            className="w-full h-auto rounded-md object-cover"
                        />

                        {/* Two smaller images side by side */}
                        <div className="flex gap-2">
                            <img
                                src="/img/img-2.jpeg"
                                alt="Back View"
                                className="w-1/2 h-auto rounded-md object-cover"
                            />
                            <img
                                src="/img/img-3.jpeg"
                                alt="Final Look"
                                className="w-1/2 h-auto rounded-md object-cover"
                            />
                        </div>
                    </div>
                </div>


                {/* Content Section */}
                <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-semibold text-pink-900 mb-4">Introducing</h2>
                    <h1 className="text-5xl font-bold text-pink-900 mb-6">INSTANT SAREE™</h1>
                    <p className="text-lg text-gray-700 mb-6">Saree Draping, Simplified just under 60 seconds!</p>
                    <button className="bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition">
                        PRE DRAPE ALL SAREES
                    </button>
                </div>
            </div>

            {/* Floating Buttons (Bottom Right) */}

        </section >
    );
}
