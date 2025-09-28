import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Archive, Search, Download, FileText, Calendar, Filter, Eye } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  uploadDate: string;
  fileSize: string;
  downloadCount: number;
  status: 'active' | 'archived' | 'restricted';
}

const documents: Document[] = [
  {
    id: 'DOC-2024-001',
    title: 'Annual Financial Report 2023',
    description: 'Comprehensive financial analysis and performance metrics for fiscal year 2023',
    category: 'Financial',
    type: 'PDF',
    uploadDate: '2024-01-15',
    fileSize: '2.4 MB',
    downloadCount: 127,
    status: 'active'
  },
  {
    id: 'DOC-2024-002',
    title: 'Employee Handbook v3.2',
    description: 'Updated policies, procedures, and guidelines for all company employees',
    category: 'HR',
    type: 'PDF',
    uploadDate: '2024-01-10',
    fileSize: '1.8 MB',
    downloadCount: 89,
    status: 'active'
  },
  {
    id: 'DOC-2024-003',
    title: 'Product Specifications Database',
    description: 'Technical specifications and documentation for all registered products',
    category: 'Technical',
    type: 'XLSX',
    uploadDate: '2024-01-08',
    fileSize: '5.2 MB',
    downloadCount: 234,
    status: 'active'
  },
  {
    id: 'DOC-2023-045',
    title: 'Q4 2023 Board Meeting Minutes',
    description: 'Official minutes from quarterly board meeting including strategic decisions',
    category: 'Corporate',
    type: 'DOCX',
    uploadDate: '2023-12-20',
    fileSize: '856 KB',
    downloadCount: 45,
    status: 'archived'
  },
  {
    id: 'DOC-2023-044',
    title: 'Security Protocols Manual',
    description: 'Comprehensive security guidelines and emergency procedures',
    category: 'Security',
    type: 'PDF',
    uploadDate: '2023-12-15',
    fileSize: '3.1 MB',
    downloadCount: 67,
    status: 'restricted'
  }
];

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-500' },
  archived: { label: 'Archived', color: 'bg-yellow-500' },
  restricted: { label: 'Restricted', color: 'bg-red-500' }
};

const typeIcons = {
  PDF: FileText,
  DOCX: FileText,
  XLSX: FileText,
  default: FileText
};

const Archives = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  const categories = ['All', ...new Set(documents.map(doc => doc.category))];
  const years = ['All', ...new Set(documents.map(doc => new Date(doc.uploadDate).getFullYear().toString()))];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesYear = selectedYear === 'All' || new Date(doc.uploadDate).getFullYear().toString() === selectedYear;
    return matchesSearch && matchesCategory && matchesYear;
  });

  const handleDownload = (docId: string, title: string) => {
    // Simulate download
    console.log(`Downloading document: ${title}`);
    // In real app, this would trigger actual file download
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="glass-card w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Archive className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Document Archives</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access and manage your organization's document repository
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="premium-card">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-xl text-sm"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-xl text-sm"
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Documents Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="premium-card overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Documents ({filteredDocuments.length})</span>
                <div className="text-sm text-muted-foreground">
                  Total Size: {documents.reduce((acc, doc) => acc + parseFloat(doc.fileSize), 0).toFixed(1)} MB
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc, index) => {
                      const TypeIcon = typeIcons[doc.type as keyof typeof typeIcons] || typeIcons.default;
                      return (
                        <motion.tr
                          key={doc.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          className="hover:bg-muted/50"
                        >
                          <TableCell>
                            <div className="flex items-start space-x-3">
                              <div className="glass-card p-2 rounded-lg flex-shrink-0">
                                <TypeIcon className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{doc.title}</div>
                                <div className="text-sm text-muted-foreground line-clamp-2">
                                  {doc.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{doc.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {doc.type}
                            </code>
                          </TableCell>
                          <TableCell>
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{doc.fileSize}</TableCell>
                          <TableCell>{doc.downloadCount}</TableCell>
                          <TableCell>
                            <Badge className={`${statusConfig[doc.status].color} text-white`}>
                              {statusConfig[doc.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload(doc.id, doc.title)}
                                disabled={doc.status === 'restricted'}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {filteredDocuments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Archive className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No documents found matching your criteria.</p>
          </motion.div>
        )}

        {/* Archive Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="premium-card bg-gradient-to-br from-primary/5 to-primary-glow/5">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">{documents.length}</div>
                  <div className="text-sm text-muted-foreground">Total Documents</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">{categories.length - 1}</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {documents.reduce((acc, doc) => acc + doc.downloadCount, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Downloads</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {documents.reduce((acc, doc) => acc + parseFloat(doc.fileSize), 0).toFixed(1)}MB
                  </div>
                  <div className="text-sm text-muted-foreground">Storage Used</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Archives;