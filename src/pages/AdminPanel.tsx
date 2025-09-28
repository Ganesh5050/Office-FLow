import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Users, 
  Package, 
  Archive, 
  Camera, 
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  TrendingUp,
  Calendar,
  Bell
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sample data for demonstration
  const dashboardStats = [
    { title: 'Total Staff', value: '156', change: '+12%', icon: Users, color: 'text-blue-500' },
    { title: 'Active Products', value: '89', change: '+5%', icon: Package, color: 'text-green-500' },
    { title: 'Facilities', value: '12', change: '+2%', icon: MapPin, color: 'text-purple-500' },
    { title: 'Documents', value: '234', change: '+18%', icon: Archive, color: 'text-orange-500' }
  ];

  const recentActivity = [
    { action: 'New staff member added', user: 'Sarah Johnson', time: '2 hours ago', type: 'staff' },
    { action: 'Product PR-2024004 approved', user: 'System', time: '4 hours ago', type: 'product' },
    { action: 'Facility booking confirmed', user: 'Michael Chen', time: '6 hours ago', type: 'facility' },
    { action: 'Document uploaded', user: 'Emma Rodriguez', time: '1 day ago', type: 'archive' }
  ];

  const managementSections = [
    { id: 'staff', title: 'Staff Management', icon: Users, count: 156 },
    { id: 'products', title: 'Product Management', icon: Package, count: 89 },
    { id: 'facilities', title: 'Facility Management', icon: MapPin, count: 12 },
    { id: 'archives', title: 'Archive Management', icon: Archive, count: 234 },
    { id: 'gallery', title: 'Gallery Management', icon: Camera, count: 67 }
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
              <p className="text-muted-foreground">Manage your organization's data and settings</p>
            </div>
            <div className="glass-card w-16 h-16 rounded-2xl flex items-center justify-center">
              <Settings className="h-8 w-8 text-primary" />
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-12 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden md:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Staff</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span className="hidden md:inline">Products</span>
              </TabsTrigger>
              <TabsTrigger value="facilities" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden md:inline">Facilities</span>
              </TabsTrigger>
              <TabsTrigger value="archives" className="flex items-center space-x-2">
                <Archive className="h-4 w-4" />
                <span className="hidden md:inline">Archives</span>
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center space-x-2">
                <Camera className="h-4 w-4" />
                <span className="hidden md:inline">Gallery</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {dashboardStats.map((stat, index) => (
                <Card key={stat.title} className="premium-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className={`text-sm ${stat.color} flex items-center space-x-1`}>
                          <TrendingUp className="h-3 w-3" />
                          <span>{stat.change}</span>
                        </p>
                      </div>
                      <div className={`glass-card p-3 rounded-xl ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="premium-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-primary" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 glass-card rounded-xl">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">
                            by {activity.user} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="premium-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Plus className="h-5 w-5 text-primary" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-3">
                    {managementSections.map((section) => (
                      <Button
                        key={section.id}
                        variant="ghost"
                        className="justify-between h-auto p-4 glass-card"
                        onClick={() => setActiveTab(section.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <section.icon className="h-5 w-5 text-primary" />
                          <span>{section.title}</span>
                        </div>
                        <Badge variant="secondary">{section.count}</Badge>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Management Tabs */}
          {managementSections.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="premium-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <section.icon className="h-6 w-6 text-primary" />
                        <span>{section.title}</span>
                      </div>
                      <Button variant="premium">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Management Interface */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 glass-card rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 glass-card rounded-lg flex items-center justify-center">
                            <section.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Sample {section.title.split(' ')[0]} Entry</h4>
                            <p className="text-sm text-muted-foreground">
                              Example entry for {section.title.toLowerCase()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-center py-8">
                        <section.icon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                        <p className="text-muted-foreground mb-4">
                          Manage your {section.title.toLowerCase()} entries, add new items, and configure settings.
                        </p>
                        <Button variant="premium">
                          Get Started
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;