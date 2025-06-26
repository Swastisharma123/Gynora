
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Share2, Mail, TrendingUp, Calendar } from 'lucide-react';

const ReportsPage = () => {
  const reports = [
    {
      title: "December 2024 Wellness Summary",
      date: "Dec 25, 2024",
      type: "Monthly Report",
      status: "Ready",
      insights: ["15% improvement in acne", "Stable hormone levels", "Regular exercise routine"]
    },
    {
      title: "PCOS Progress Report",
      date: "Dec 20, 2024",
      type: "Progress Report",
      status: "Ready",
      insights: ["PCOS score decreased", "Better symptom management", "Improved lifestyle habits"]
    },
    {
      title: "Hormone Analysis",
      date: "Dec 15, 2024",
      type: "Lab Report",
      status: "Ready",
      insights: ["Testosterone levels normal", "Insulin sensitivity improved", "Thyroid function stable"]
    }
  ];

  const upcomingReports = [
    { title: "Year-end Summary", dueDate: "Jan 1, 2025" },
    { title: "Quarterly Analysis", dueDate: "Jan 15, 2025" }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 gradient-teal rounded-full mx-auto mb-3 flex items-center justify-center">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gradient">Health Reports</h2>
        <p className="text-gray-600">Track your progress and share with your doctor</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Button variant="outline" className="h-16 flex-col space-y-2 border-purple-200">
          <Download className="w-5 h-5 text-purple-600" />
          <span className="text-xs">Download</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col space-y-2 border-purple-200">
          <Share2 className="w-5 h-5 text-purple-600" />
          <span className="text-xs">Share</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col space-y-2 border-purple-200">
          <Mail className="w-5 h-5 text-purple-600" />
          <span className="text-xs">Email Dr.</span>
        </Button>
      </div>

      {/* Available Reports */}
      <div>
        <h3 className="font-semibold mb-4">Available Reports</h3>
        <div className="space-y-4">
          {reports.map((report, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{report.title}</h4>
                  <p className="text-xs text-gray-500">{report.date} • {report.type}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                  {report.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-xs font-medium text-gray-700">Key Insights:</p>
                {report.insights.map((insight, idx) => (
                  <div key={idx} className="flex items-center text-xs text-gray-600">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                    {insight}
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1 gradient-wellness text-white">
                  <Download className="w-3 h-3 mr-1" />
                  Download PDF
                </Button>
                <Button size="sm" variant="outline" className="border-purple-200 text-purple-600">
                  <Share2 className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
          Progress Overview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600 mb-1">85%</div>
            <p className="text-xs text-green-600">Wellness Score</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 mb-1">12</div>
            <p className="text-xs text-purple-600">Reports Generated</p>
          </div>
        </div>
      </Card>

      {/* Upcoming Reports */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-purple-600" />
          Upcoming Reports
        </h3>
        <div className="space-y-3">
          {upcomingReports.map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <div>
                <p className="font-medium text-sm">{report.title}</p>
                <p className="text-xs text-gray-600">Due: {report.dueDate}</p>
              </div>
              <Button size="sm" variant="ghost" className="text-purple-600">
                Set Reminder
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Doctor Sync */}
      <Card className="p-6 gradient-gentle text-white">
        <h3 className="font-semibold mb-2">Sync with Your Doctor</h3>
        <p className="text-sm opacity-90 mb-4">
          Share your progress reports directly with your healthcare provider for better care coordination.
        </p>
        <Button variant="secondary" size="sm">
          Add Doctor Email
        </Button>
      </Card>
    </div>
  );
};

export default ReportsPage;
