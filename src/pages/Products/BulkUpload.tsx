import React, { useState } from 'react';
import { Card, Row, Col, Upload, Button, Typography, Steps, Table, Progress, Alert, App } from 'antd';
import {
  CloudUploadOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';

const { Title } = Typography;
const { Dragger } = Upload;
const { Step } = Steps;

const BulkUpload: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploading, setUploading] = useState(false);

  const downloadTemplate = () => {
    // Create a simple CSV template
    const headers = ['Product Name', 'SKU', 'Category', 'Price', 'Stock Quantity', 'Description', 'Brand'];
    const sampleData = [
      ['Sample Product 1', 'SKU001', 'Women/Clothing/Dresses', '29.99', '100', 'Beautiful summer dress', 'Fashion Brand'],
      ['Sample Product 2', 'SKU002', 'Men/Clothing/Shirts', '39.99', '50', 'Comfortable cotton shirt', 'Style Co']
    ];

    const csvContent = [headers, ...sampleData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'product_upload_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Template downloaded successfully');
  };

  const processUpload = () => {
    setUploading(true);
    // Simulate processing
    setTimeout(() => {
      setUploading(false);
      setCurrentStep(3);
      message.success('File processed successfully! 45 products imported.');
    }, 3000);
  };

  const downloadSampleTemplate = () => {
    downloadTemplate();
    message.info('Sample template with example data downloaded');
  };
  const uploadHistory = [
    {
      key: '1',
      filename: 'products_batch_001.xlsx',
      uploadDate: '2024-01-07 10:30:00',
      status: 'completed',
      totalRows: 150,
      successful: 147,
      failed: 3,
    },
    {
      key: '2',
      filename: 'summer_collection.csv',
      uploadDate: '2024-01-06 14:20:00',
      status: 'completed',
      totalRows: 89,
      successful: 89,
      failed: 0,
    },
    {
      key: '3',
      filename: 'accessories_update.xlsx',
      uploadDate: '2024-01-05 09:15:00',
      status: 'failed',
      totalRows: 45,
      successful: 12,
      failed: 33,
    },
  ];

  const columns = [
    {
      title: 'Filename',
      dataIndex: 'filename',
      key: 'filename',
      render: (filename: string) => (
        <div className="flex items-center space-x-2">
          <FileExcelOutlined />
          <span>{filename}</span>
        </div>
      ),
    },
    {
      title: 'Upload Date',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          completed: 'green',
          failed: 'red',
          processing: 'blue',
        };
        const icons = {
          completed: <CheckCircleOutlined />,
          failed: <CloseCircleOutlined />,
          processing: <SyncOutlined spin />,
        };
        return (
          <div className={`text-${colors[status as keyof typeof colors]}-600 flex items-center space-x-2`}>
            {icons[status as keyof typeof icons]}
            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
          </div>
        );
      },
    },
    {
      title: 'Results',
      key: 'results',
      render: (record: any) => (
        <div className="text-center">
          <div className="text-sm">
            <span className="text-green-600">{record.successful} successful</span>
            {record.failed > 0 && (
              <span className="text-red-600"> • {record.failed} failed</span>
            )}
          </div>
          <Progress
            percent={(record.successful / record.totalRows) * 100}
            size="small"
            showInfo={false}
            strokeColor={record.failed > 0 ? '#faad14' : '#52c41a'}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">Bulk Product Upload</Title>
          <p className="text-gray-600">Upload multiple products using CSV or Excel files</p>
        </div>
        <Button icon={<DownloadOutlined />} size="large" onClick={downloadTemplate}>
          Download Template
        </Button>
      </div>

      {/* Upload Process Steps */}
      <Card>
        <Steps current={currentStep} className="mb-6">
          <Step title="Download Template" description="Get the correct format" />
          <Step title="Prepare Data" description="Fill in product information" />
          <Step title="Upload File" description="Upload your completed file" />
          <Step title="Review & Process" description="Validate and import products" />
        </Steps>
      </Card>

      <Row gutter={[16, 16]}>
        {/* Upload Area */}
        <Col xs={24} lg={12}>
          <Card title="Upload Products">
            <Alert
              message="File Requirements"
              description="Supported formats: .xlsx, .csv, .xls. Maximum file size: 10MB. Maximum 1000 products per upload."
              type="info"
              className="mb-4"
            />
            
            <Dragger
              name="file"
              multiple={false}
              action="/api/upload"
              accept=".xlsx,.csv,.xls"
              className="mb-4"
            >
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Upload your product data file. Make sure to use our template format.
              </p>
            </Dragger>

            <div className="space-y-3">
              <Button
                block
                type="primary"
                size="large"
                loading={uploading}
                onClick={processUpload}
              >
                {uploading ? 'Processing...' : 'Process Upload'}
              </Button>
              <Button block icon={<FileExcelOutlined />} onClick={downloadSampleTemplate}>
                Download Sample Template
              </Button>
            </div>
          </Card>
        </Col>

        {/* Guidelines */}
        <Col xs={24} lg={12}>
          <Card title="Upload Guidelines">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Required Fields:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Product Name</li>
                  <li>SKU (must be unique)</li>
                  <li>Category</li>
                  <li>Price</li>
                  <li>Stock Quantity</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Optional Fields:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Description</li>
                  <li>Brand</li>
                  <li>Weight</li>
                  <li>Dimensions</li>
                  <li>Tags</li>
                  <li>Images (URLs)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Tips for Success:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Use the provided template</li>
                  <li>Ensure SKUs are unique</li>
                  <li>Use valid category names</li>
                  <li>Check image URLs are accessible</li>
                  <li>Validate data before upload</li>
                </ul>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Upload Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-600">5</div>
            <div className="text-gray-600">Total Uploads</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-600">284</div>
            <div className="text-gray-600">Products Added</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-orange-600">36</div>
            <div className="text-gray-600">Failed Imports</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-purple-600">92%</div>
            <div className="text-gray-600">Success Rate</div>
          </Card>
        </Col>
      </Row>

      {/* Upload History */}
      <Card title="Upload History">
        <Table
          columns={columns}
          dataSource={uploadHistory}
          pagination={false}
        />
      </Card>

      {/* Common Errors */}
      <Card title="Common Upload Errors">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded">
                <div className="font-medium text-red-800">Duplicate SKU</div>
                <div className="text-sm text-red-600">Each product must have a unique SKU</div>
              </div>
              <div className="p-3 bg-red-50 rounded">
                <div className="font-medium text-red-800">Invalid Category</div>
                <div className="text-sm text-red-600">Category must exist in your catalog</div>
              </div>
              <div className="p-3 bg-red-50 rounded">
                <div className="font-medium text-red-800">Missing Required Field</div>
                <div className="text-sm text-red-600">All required fields must be filled</div>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded">
                <div className="font-medium text-red-800">Invalid Price Format</div>
                <div className="text-sm text-red-600">Price must be a valid number</div>
              </div>
              <div className="p-3 bg-red-50 rounded">
                <div className="font-medium text-red-800">Image URL Not Accessible</div>
                <div className="text-sm text-red-600">Image URLs must be publicly accessible</div>
              </div>
              <div className="p-3 bg-red-50 rounded">
                <div className="font-medium text-red-800">Invalid Data Format</div>
                <div className="text-sm text-red-600">Data doesn't match expected format</div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default BulkUpload;
