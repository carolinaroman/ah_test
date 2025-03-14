import {useEffect, useState} from "react";

/**
 * A basic component that renders a container div with text content
 *
 * @component
 * @returns {JSX.Element} A div element with simple content
 *
 * @example
 * return (
 *   <Matches />
 * )
 */
const Matches = () => {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const formResponse = localStorage.getItem('formResponse');
    if (formResponse) {
      setProviders(JSON.parse(formResponse));
    }
  }, []);

  // Determine grid class based on number of providers
  // I want 33% columns if there are 3 results, 50% if there are 2 or 1
  const getGridClass = () => {
    if (providers.length === 1) {
      return 'grid grid-cols-1 w-1/2 mx-auto'; // Single card takes 50% width
    } else if (providers.length === 2) {
      return 'grid grid-cols-2 w-4/5 mx-auto gap-8'; // Two cards, each taking ~50% width
    } else {
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'; // Three or more cards
    }
  };

  if (providers.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gray-100 px-10 pt-10 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            No Matching Providers Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find any providers matching your criteria. Try adjusting your preferences to see more results.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="w-full min-h-screen bg-gray-100 px-10 pt-10">
      <div className={getGridClass()}>
        {providers.map((provider, index) => (
          <div key={index} className="relative mt-16 mb-32">
            <div className="rounded overflow-hidden shadow-md bg-white">
              <div className="absolute -mt-20 w-full flex justify-center">
                <div className="h-32 w-32">
                  <img
                    src={`https://randomuser.me/api/portraits/${provider['gender identity'].toLowerCase() === 'female' ? 'women' : 'men'}/${index + 1}.jpg`}
                    className="rounded-full object-cover h-full w-full shadow-md"
                    alt={`${provider['first name']} ${provider['last name']}`}
                  />
                </div>
              </div>
              <div className="px-6 mt-16">
                <h1 className="font-bold text-3xl text-center mb-1">
                  {provider['first name']} {provider['last name']}
                </h1>
                <p className="text-gray-800 text-sm text-center">
                  {provider['ethnic identity']} • {provider['gender identity']}
                </p>
                <p className="text-gray-600 text-sm text-center mt-1">
                  Languages: {provider.language}
                </p>
                <p className="text-center text-gray-600 text-base pt-3 font-normal">
                  {provider.bio}
                </p>
                <div className="mt-4 mb-4">
                  <p className="text-sm font-semibold text-center">Specializations:</p>
                  <p className="text-sm text-gray-600 text-center">
                    {provider['areas of specialization']}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 mt-4 rounded-b">
                  <p className="text-sm text-center text-gray-600">
                    Licensed in: {provider['state licensed']}
                  </p>
                  <p className="text-sm text-center text-gray-600 mt-1">
                    Available slots: {provider['no of clients able to take on']}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


};

export default Matches;
