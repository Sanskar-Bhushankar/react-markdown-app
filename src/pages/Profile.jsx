import React, { useEffect, useState } from 'react';
import { fetchFilesList, fetchFileContent } from '../utils/fileUtils';

const ContributionGraph = () => {
  const [contributions, setContributions] = useState({});
  const [fileDetails, setFileDetails] = useState({});

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const indexContent = await fetchFileContent('index.md');
        const contributionsMap = {};
        const filesMap = {};

        const lines = indexContent.split('\n');
        lines.forEach(line => {
          const match = line.match(/\[(.*?)\].*?(\d{1,2}:\d{2} [AP]M) - ([A-Za-z]+ \d{1,2}, \d{4})/);
          
          if (match) {
            const fileName = match[1];
            const date = new Date(match[3]);
            const formattedDate = date.toISOString().split('T')[0];
            
            contributionsMap[formattedDate] = (contributionsMap[formattedDate] || 0) + 1;
            
            if (!filesMap[formattedDate]) {
              filesMap[formattedDate] = [];
            }
            filesMap[formattedDate].push(fileName);
          }
        });

        setContributions(contributionsMap);
        setFileDetails(filesMap);
      } catch (error) {
        console.error('Error fetching contributions:', error);
      }
    };

    fetchContributions();
  }, []);

  const getDaysInMonth = (month) => {
    const year = new Date().getFullYear();
    return new Date(year, month + 1, 0).getDate();
  };

  const months = Array.from({ length: 12 }, (_, i) => i);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getContributionLevel = (count) => {
    if (!count) return 'bg-gray-100 dark:bg-gray-700';
    if (count === 1) return 'bg-green-200 dark:bg-green-900';
    if (count <= 3) return 'bg-green-300 dark:bg-green-700';
    if (count <= 5) return 'bg-green-400 dark:bg-green-500';
    return 'bg-green-500 dark:bg-green-300';
  };

  const getDateString = (month, day) => {
    const year = new Date().getFullYear();
    return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm">
      <h2 className="text-lg font-semibold mb-6 text-gray-700 dark:text-gray-300">
        Contribution Activity
      </h2>
      
      <div className="flex flex-col gap-3">
        {/* Month labels */}
        <div className="flex">
          <div className="w-12"></div>
          <div className="flex flex-1">
            {monthNames.map(month => (
              <div key={month} className="flex-1 text-xs font-medium text-gray-500 dark:text-gray-400 pl-[2px]">
                {month}
              </div>
            ))}
          </div>
        </div>
        
        {/* Contribution boxes */}
        <div className="flex">
          <div className="w-12"></div>
          <div className="flex gap-3">
            {months.map(month => (
              <div key={month}>
                <div className="grid grid-rows-7 grid-flow-col gap-[2px]">
                  {Array.from({ length: getDaysInMonth(month) }, (_, day) => {
                    const dateKey = getDateString(month, day);
                    const count = contributions[dateKey] || 0;
                    const files = fileDetails[dateKey] || [];
                    
                    return (
                      <div
                        key={day}
                        className={`
                          w-[10px] h-[10px] rounded-sm
                          ${getContributionLevel(count)}
                          hover:ring-1 hover:ring-blue-400 
                          transition-all cursor-pointer relative
                          group
                        `}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                                      hidden group-hover:block z-50">
                          <div className="bg-gray-900 text-white text-xs rounded py-2 px-3 
                                        whitespace-nowrap shadow-lg">
                            <div>{count} contribution{count !== 1 ? 's' : ''} on {dateKey}</div>
                            {files.length > 0 && (
                              <div className="mt-1 text-gray-300 text-[10px]">
                                {files.map((file, i) => (
                                  <div key={i}>{file}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span>Less</span>
        <div className="flex gap-[3px]">
          <div className="w-[10px] h-[10px] bg-gray-100 dark:bg-gray-700 rounded-sm"></div>
          <div className="w-[10px] h-[10px] bg-green-200 dark:bg-green-900 rounded-sm"></div>
          <div className="w-[10px] h-[10px] bg-green-300 dark:bg-green-700 rounded-sm"></div>
          <div className="w-[10px] h-[10px] bg-green-400 dark:bg-green-500 rounded-sm"></div>
          <div className="w-[10px] h-[10px] bg-green-500 dark:bg-green-300 rounded-sm"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

const Profile = () => {
  return (
    <div className="max-w-[1200px]">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        My Profile
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Hello, I am a student
      </p>
      
      <ContributionGraph />
    </div>
  );
};

export default Profile;