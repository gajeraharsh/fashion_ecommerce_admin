import React from 'react';
import { Card, Row, Col, Statistic, Button, Table, Tag, Progress, Typography } from 'antd';
import {
  SearchOutlined,
  RiseOutlined,
  EyeOutlined,
  GlobalOutlined,
  BarChartOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const SEOManager: React.FC = () => {
  const mockData = [
    {
      key: '1',
      page: 'Homepage',
      keywords: ['fashion', 'clothing', 'style'],
      ranking: 3,
      traffic: 2450,
      score: 85,
    },
    {
      key: '2',
      page: 'Summer Collection',
      keywords: ['summer fashion', 'collection'],
      ranking: 7,
      traffic: 1230,
      score: 78,
    },
    {
      key: '3',
      page: 'Product Page - Dress',
      keywords: ['designer dress', 'evening wear'],
      ranking: 12,
      traffic: 890,
      score: 72,
    },
  ];

  const columns = [
    {
      title: 'Page',
      dataIndex: 'page',
      key: 'page',
    },
    {
      title: 'Keywords',
      dataIndex: 'keywords',
      key: 'keywords',
      render: (keywords: string[]) => (
        <div>
          {keywords.map(keyword => (
            <Tag key={keyword} size="small">{keyword}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Ranking',
      dataIndex: 'ranking',
      key: 'ranking',
      render: (ranking: number) => (
        <span className={ranking <= 5 ? 'text-green-600' : ranking <= 10 ? 'text-orange-600' : 'text-red-600'}>
          #{ranking}
        </span>
      ),
    },
    {
      title: 'Traffic',
      dataIndex: 'traffic',
      key: 'traffic',
      render: (traffic: number) => (
        <span>{traffic.toLocaleString()} visits</span>
      ),
    },
    {
      title: 'SEO Score',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => (
        <Progress percent={score} size="small" strokeColor={score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#ff4d4f'} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">SEO Management</Title>
          <p className="text-gray-600">Monitor and optimize your search engine performance</p>
        </div>
        <Button type="primary" icon={<FileSearchOutlined />} size="large">
          SEO Audit
        </Button>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Avg SEO Score"
              value={78}
              suffix="/100"
              valueStyle={{ color: '#f5a623', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Organic Traffic"
              value={4570}
              valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<EyeOutlined />}
              suffix={
                <div className="text-sm text-green-600 mt-1">
                  <RiseOutlined /> +12.5%
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Keywords Tracked"
              value={247}
              valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<SearchOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Top 10 Rankings"
              value={34}
              valueStyle={{ color: '#722ed1', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<GlobalOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* SEO Performance Table */}
      <Card title="Page Performance" className="mb-6">
        <Table
          columns={columns}
          dataSource={mockData}
          pagination={false}
        />
      </Card>

      {/* Additional SEO Tools */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Quick Actions" className="h-full">
            <div className="space-y-3">
              <Button block icon={<SearchOutlined />}>Keyword Research</Button>
              <Button block icon={<FileSearchOutlined />}>Site Audit</Button>
              <Button block icon={<BarChartOutlined />}>Rank Tracking</Button>
              <Button block icon={<GlobalOutlined />}>Sitemap Generator</Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="SEO Health" className="h-full">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Page Speed</span>
                <Progress percent={92} size="small" strokeColor="#52c41a" />
              </div>
              <div className="flex justify-between items-center">
                <span>Mobile Friendliness</span>
                <Progress percent={88} size="small" strokeColor="#52c41a" />
              </div>
              <div className="flex justify-between items-center">
                <span>Meta Tags</span>
                <Progress percent={75} size="small" strokeColor="#faad14" />
              </div>
              <div className="flex justify-between items-center">
                <span>Internal Links</span>
                <Progress percent={65} size="small" strokeColor="#ff4d4f" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SEOManager;
