import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Mail, Phone, MapPin, Calendar, User } from 'lucide-react';

import staff1 from '@/assets/staff-1.jpg';
import staff2 from '@/assets/staff-2.jpg';
import staff3 from '@/assets/staff-3.jpg';
import staff4 from '@/assets/staff-4.jpg';
import staff5 from '@/assets/staff-5.jpg';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  bio: string;
  image: string;
}

const staffData: StaffMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Chief Executive Officer',
    department: 'Executive',
    email: 'sarah.johnson@officeflow.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    joinDate: '2019-01-15',
    bio: 'Leading OfficeFlow with 15+ years of experience in enterprise management and strategic development.',
    image: staff1
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Chief Technology Officer',
    department: 'Technology',
    email: 'michael.chen@officeflow.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    joinDate: '2020-03-22',
    bio: 'Driving technological innovation with expertise in software architecture and product development.',
    image: staff2
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    role: 'Head of Operations',
    department: 'Operations',
    email: 'emma.rodriguez@officeflow.com',
    phone: '+1 (555) 345-6789',
    location: 'Chicago, IL',
    joinDate: '2018-08-10',
    bio: 'Optimizing operational efficiency and ensuring seamless business processes across all departments.',
    image: staff3
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Senior Product Manager',
    department: 'Product',
    email: 'david.kim@officeflow.com',
    phone: '+1 (555) 456-7890',
    location: 'Austin, TX',
    joinDate: '2021-06-01',
    bio: 'Focusing on product strategy and user experience to deliver exceptional solutions for our clients.',
    image: staff4
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    role: 'Business Analyst',
    department: 'Analytics',
    email: 'lisa.thompson@officeflow.com',
    phone: '+1 (555) 567-8901',
    location: 'Boston, MA',
    joinDate: '2022-02-14',
    bio: 'Analyzing business metrics and providing data-driven insights to support strategic decision making.',
    image: staff5
  }
];

const StaffDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const departments = ['All', ...new Set(staffData.map(staff => staff.department))];

  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || staff.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the talented professionals driving OfficeFlow's success
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 rounded-xl"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {departments.map((dept) => (
              <Button
                key={dept}
                variant={selectedDepartment === dept ? "premium" : "ghost"}
                size="sm"
                onClick={() => setSelectedDepartment(dept)}
              >
                {dept}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStaff.map((staff, index) => (
            <motion.div
              key={staff.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="premium-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={staff.image} 
                      alt={staff.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{staff.name}</h3>
                    <p className="text-primary font-medium mb-2">{staff.role}</p>
                    <Badge variant="secondary" className="mb-4">
                      {staff.department}
                    </Badge>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="premium" className="w-full">
                          View Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">Staff Profile</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-1">
                            <img 
                              src={staff.image} 
                              alt={staff.name}
                              className="w-full aspect-square object-cover rounded-xl"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-4">
                            <div>
                              <h3 className="text-2xl font-bold">{staff.name}</h3>
                              <p className="text-lg text-primary font-medium">{staff.role}</p>
                              <Badge variant="secondary" className="mt-2">{staff.department}</Badge>
                            </div>
                            
                            <p className="text-muted-foreground">{staff.bio}</p>
                            
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <Mail className="h-4 w-4 text-primary" />
                                <span className="text-sm">{staff.email}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Phone className="h-4 w-4 text-primary" />
                                <span className="text-sm">{staff.phone}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="text-sm">{staff.location}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span className="text-sm">Joined {new Date(staff.joinDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No staff members found matching your criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StaffDirectory;