import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Select,
  Switch,
  Upload,
  App,
  Tabs,
  Divider,
  Space,
  Typography,
  ColorPicker,
  Modal,
} from 'antd';
import {
  SaveOutlined,
  UploadOutlined,
  GlobalOutlined,
  ShoppingOutlined,
  BgColorsOutlined,
  SafetyOutlined,
  ApiOutlined,
  BellOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Paragraph } = Typography;

const SiteSettings: React.FC = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Settings saved successfully!');
    } catch (error) {
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'general',
      label: <span><GlobalOutlined /> General</span>,
      children: (
        <Row gutter={[24, 0]}>
          <Col xs={24} lg={16}>
            <Card title="Basic Information" className="mb-6">
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name={['general', 'siteName']}
                    label="Site Name"
                    rules={[{ required: true, message: 'Please enter site name' }]}
                  >
                    <Input placeholder="Fashion Store" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name={['general', 'tagline']} label="Tagline">
                    <Input placeholder="Your Style, Your Way" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item name={['general', 'description']} label="Site Description">
                <TextArea
                  rows={3}
                  placeholder="Brief description of your store"
                />
              </Form.Item>
              
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item name={['general', 'logo']} label="Logo">
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>Upload Logo</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name={['general', 'favicon']} label="Favicon">
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>Upload Favicon</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Localization">
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item name={['general', 'language']} label="Default Language">
                    <Select placeholder="Select language">
                      <Option value="en">English</Option>
                      <Option value="es">Spanish</Option>
                      <Option value="fr">French</Option>
                      <Option value="de">German</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name={['general', 'currency']} label="Default Currency">
                    <Select placeholder="Select currency">
                      <Option value="USD">USD - US Dollar</Option>
                      <Option value="EUR">EUR - Euro</Option>
                      <Option value="GBP">GBP - British Pound</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Contact Information" className="mb-6">
              <Form.Item name={['general', 'email']} label="Contact Email">
                <Input type="email" placeholder="info@yourstore.com" />
              </Form.Item>
              
              <Form.Item name={['general', 'phone']} label="Phone Number">
                <Input placeholder="+1 (555) 123-4567" />
              </Form.Item>
              
              <Form.Item name={['general', 'address']} label="Business Address">
                <TextArea rows={3} placeholder="Enter your business address" />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'ecommerce',
      label: <span><ShoppingOutlined /> E-commerce</span>,
      children: (
        <Row gutter={[24, 0]}>
          <Col xs={24} lg={12}>
            <Card title="Order Settings" className="mb-6">
              <Form.Item name={['ecommerce', 'autoApproveOrders']} valuePropName="checked">
                <Switch /> Auto-approve orders
              </Form.Item>
              
              <Form.Item name={['ecommerce', 'allowGuestCheckout']} valuePropName="checked">
                <Switch defaultChecked /> Allow guest checkout
              </Form.Item>
              
              <Form.Item name={['ecommerce', 'requireAccountForPurchase']} valuePropName="checked">
                <Switch /> Require account for purchase
              </Form.Item>
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            <Card title="Inventory Settings" className="mb-6">
              <Form.Item name={['ecommerce', 'trackInventory']} valuePropName="checked">
                <Switch defaultChecked /> Track inventory
              </Form.Item>
              
              <Form.Item name={['ecommerce', 'allowBackorders']} valuePropName="checked">
                <Switch /> Allow backorders
              </Form.Item>
              
              <Form.Item name={['ecommerce', 'hideOutOfStock']} valuePropName="checked">
                <Switch /> Hide out of stock products
              </Form.Item>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'theme',
      label: <span><BgColorsOutlined /> Theme</span>,
      children: (
        <Row gutter={[24, 0]}>
          <Col xs={24} lg={12}>
            <Card title="Color Scheme" className="mb-6">
              <Form.Item name={['theme', 'primaryColor']} label="Primary Color">
                <ColorPicker defaultValue="#1890ff" showText />
              </Form.Item>
              
              <Form.Item name={['theme', 'secondaryColor']} label="Secondary Color">
                <ColorPicker defaultValue="#52c41a" showText />
              </Form.Item>
              
              <Form.Item name={['theme', 'accentColor']} label="Accent Color">
                <ColorPicker defaultValue="#fa541c" showText />
              </Form.Item>
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            <Card title="Typography" className="mb-6">
              <Form.Item name={['theme', 'fontFamily']} label="Font Family">
                <Select placeholder="Select font">
                  <Option value="inter">Inter</Option>
                  <Option value="roboto">Roboto</Option>
                  <Option value="montserrat">Montserrat</Option>
                  <Option value="openSans">Open Sans</Option>
                </Select>
              </Form.Item>
              
              <Form.Item name={['theme', 'fontSize']} label="Base Font Size">
                <Select placeholder="Select size">
                  <Option value="14px">14px</Option>
                  <Option value="16px">16px</Option>
                  <Option value="18px">18px</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'security',
      label: <span><SafetyOutlined /> Security</span>,
      children: (
        <Card title="Security Settings">
          <Form.Item name={['security', 'enableTwoFactor']} valuePropName="checked">
            <Switch /> Enable two-factor authentication
          </Form.Item>
          
          <Form.Item name={['security', 'requireStrongPasswords']} valuePropName="checked">
            <Switch defaultChecked /> Require strong passwords
          </Form.Item>
          
          <Form.Item name={['security', 'sessionTimeout']} label="Session Timeout (minutes)">
            <Select defaultValue="30">
              <Option value="15">15 minutes</Option>
              <Option value="30">30 minutes</Option>
              <Option value="60">1 hour</Option>
              <Option value="120">2 hours</Option>
            </Select>
          </Form.Item>
        </Card>
      ),
    },
    {
      key: 'integrations',
      label: <span><ApiOutlined /> Integrations</span>,
      children: (
        <Row gutter={[24, 0]}>
          <Col xs={24} lg={12}>
            <Card title="Payment Gateways" className="mb-6">
              <Form.Item name={['integrations', 'stripeKey']} label="Stripe Publishable Key">
                <Input placeholder="pk_test_..." />
              </Form.Item>
              
              <Form.Item name={['integrations', 'paypalClientId']} label="PayPal Client ID">
                <Input placeholder="PayPal Client ID" />
              </Form.Item>
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            <Card title="Analytics" className="mb-6">
              <Form.Item name={['integrations', 'googleAnalytics']} label="Google Analytics ID">
                <Input placeholder="GA-XXXXXXXXX-X" />
              </Form.Item>
              
              <Form.Item name={['integrations', 'facebookPixel']} label="Facebook Pixel ID">
                <Input placeholder="123456789012345" />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'notifications',
      label: <span><BellOutlined /> Notifications</span>,
      children: (
        <Card title="Notification Settings">
          <Form.Item name={['notifications', 'emailNotifications']} valuePropName="checked">
            <Switch defaultChecked /> Email notifications
          </Form.Item>
          
          <Form.Item name={['notifications', 'smsNotifications']} valuePropName="checked">
            <Switch /> SMS notifications
          </Form.Item>
          
          <Form.Item name={['notifications', 'pushNotifications']} valuePropName="checked">
            <Switch defaultChecked /> Push notifications
          </Form.Item>
          
          <Form.Item name={['notifications', 'orderUpdates']} valuePropName="checked">
            <Switch defaultChecked /> Order status updates
          </Form.Item>
        </Card>
      ),
    },
    {
      key: 'advanced',
      label: <span><SettingOutlined /> Advanced</span>,
      children: (
        <Card title="Advanced Settings">
          <Form.Item name={['advanced', 'maintenanceMode']} valuePropName="checked">
            <Switch /> Maintenance mode
          </Form.Item>
          
          <Form.Item name={['advanced', 'debugMode']} valuePropName="checked">
            <Switch /> Debug mode
          </Form.Item>
          
          <Form.Item name={['advanced', 'cacheEnabled']} valuePropName="checked">
            <Switch defaultChecked /> Enable caching
          </Form.Item>
          
          <Form.Item name={['advanced', 'customCss']} label="Custom CSS">
            <TextArea rows={10} placeholder="/* Add your custom CSS here */" />
          </Form.Item>
          
          <Form.Item name={['advanced', 'customJs']} label="Custom JavaScript">
            <TextArea rows={10} placeholder="/* Add your custom JavaScript here */" />
          </Form.Item>
        </Card>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>Site Settings</Title>
        <Paragraph>Configure your store settings and preferences</Paragraph>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        className="bg-white"
        initialValues={{
          general: {
            siteName: 'Fashion Store',
            tagline: 'Your Style, Your Way',
            language: 'en',
            currency: 'USD',
          },
          ecommerce: {
            allowGuestCheckout: true,
            trackInventory: true,
          },
          theme: {
            primaryColor: '#1890ff',
            secondaryColor: '#52c41a',
            fontFamily: 'inter',
            fontSize: '16px',
          },
          security: {
            requireStrongPasswords: true,
            sessionTimeout: '30',
          },
          notifications: {
            emailNotifications: true,
            pushNotifications: true,
            orderUpdates: true,
          },
          advanced: {
            cacheEnabled: true,
          },
        }}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" items={tabItems} />

        <Divider />

        <div className="flex justify-end">
          <Space>
            <Button
              size="large"
              onClick={() => {
                Modal.confirm({
                  title: 'Reset to Defaults',
                  content: 'Are you sure you want to reset all settings to their default values? This action cannot be undone.',
                  onOk: () => message.success('Settings reset to defaults successfully'),
                });
              }}
            >
              Reset to Defaults
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={loading}
            >
              Save Settings
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default SiteSettings;
