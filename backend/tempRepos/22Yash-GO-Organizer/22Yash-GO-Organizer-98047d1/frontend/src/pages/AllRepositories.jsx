import React, { useEffect, useState } from 'react';
import { Download , ArrowLeft } from 'lucide-react';
import { generatePdfReport } from '../utils/generatePdfReport';
import { useLocation, useNavigate } from 'react-router-dom';

const AllRepositories = () => {
  const [reports, setReports] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/user-repos/${userId}`);
        const data = await res.json();
        setReports(data);
      } catch (error) {
        console.error('Error fetching repo reports:', error);
      }
    };

    if (userId) fetchReports();
  }, [userId]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-200 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
          <h1 className="text-2xl font-bold mb-4">📊 Repository Reports</h1>
            
          </div>
        </div>

      {reports.length === 0 ? (
        <p className="text-gray-500">No scanned repositories yet.</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg flex items-center justify-between bg-white shadow"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{report.repoName}</h2>
                <p className="text-gray-500">
                  Issues: <span className="font-medium">{report.issuesFound}</span> | Scanned at:{' '}
                  {new Date(report.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() =>
                  generatePdfReport({
                    repoName: report.repoName,
                    scanType: report.scanType,
                    issuesFound: report.issuesFound,
                    issues: report.issues,
                    createdAt: report.createdAt,
                  })
                }
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllRepositories;
