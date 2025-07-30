import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Row,
  Col,
  Tabs,
  Upload,
  message,
  Divider,
  InputNumber,
  ColorPicker,
  Typography,
  Space,
  Alert,
  List,
  Avatar,
  Modal,
  Table,
  Tag,
} from 'antd';
import {
  SaveOutlined,
  UploadOutlined,
  ReloadOutlined,
  SettingOutlined,
  GlobalOutlined,
  MailOutlined,
  ShoppingOutlined,
  PaletteOutlined,
  SafetyOutlined,
  ApiOutlined,
  BellOutlined,
  DollarOutlined,
  FileTextOutlined,
  CloudOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Title, Paragraph } = Typography;
const { Option } = Select;

interface SiteSettings {
  general: {
    siteName: string;
    tagline: string;
    description: string;
    logo: string;
    favicon: string;
    timezone: string;
    language: string;
    currency: string;
    dateFormat: string;
    timeFormat: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    supportEmail: string;
    salesEmail: string;
  };
  ecommerce: {
    defaultTaxRate: number;
    freeShippingThreshold: number;
    allowGuestCheckout: boolean;
    requireAccountVerification: boolean;
    inventoryManagement: boolean;
    backorderEnabled: boolean;
    lowStockThreshold: number;
    outOfStockVisibility: boolean;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: number;
    borderRadius: number;
    layoutWidth: 'full' | 'contained';
    headerStyle: 'fixed' | 'static';
  };
  security: {
    enableTwoFactor: boolean;
    passwordMinLength: number;
    passwordRequireSpecialChar: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    enableCaptcha: boolean;
    enableSSL: boolean;
    ipWhitelist: string[];
  };
  integrations: {
    googleAnalytics: string;
    facebookPixel: string;
    stripePublishableKey: string;
    stripeSecretKey: string;
    paypalClientId: string;
    mailchimpApiKey: string;
    twilioAccountSid: string;
    twilioAuthToken: string;
    awsAccessKey: string;
    awsSecretKey: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    orderConfirmation: boolean;
    shippingUpdates: boolean;
    inventoryAlerts: boolean;
    securityAlerts: boolean;
    marketingEmails: boolean;
  };
  advanced: {
    maintenanceMode: boolean;
    debugMode: boolean;
    cacheEnabled: boolean;
    compressionEnabled: boolean;
    minifyAssets: boolean;
    cookieConsent: boolean;
    gdprCompliance: boolean;
    customCSS: string;
    customJS: string;
    robotsTxt: string;
  };
}

const SiteSettings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockSettings: SiteSettings = {
      general: {
        siteName: 'Fashion Store',
        tagline: 'Your Style, Your Way',
        description: 'Premium fashion and lifestyle products for modern consumers',
        logo: '/logo.png',
        favicon: '/favicon.ico',
        timezone: 'America/New_York',
        language: 'en',
        currency: 'USD',
        dateFormat: 'MM/dd/yyyy',
        timeFormat: '12h',
      },
      contact: {
        email: 'info@fashionstore.com',
        phone: '+1-555-0123',
        address: '123 Fashion Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        supportEmail: 'support@fashionstore.com',
        salesEmail: 'sales@fashionstore.com',
      },
      ecommerce: {
        defaultTaxRate: 8.5,
        freeShippingThreshold: 75,
        allowGuestCheckout: true,
        requireAccountVerification: true,
        inventoryManagement: true,
        backorderEnabled: false,
        lowStockThreshold: 10,
        outOfStockVisibility: false,
      },
      theme: {
        primaryColor: '#1890ff',
        secondaryColor: '#52c41a',
        accentColor: '#fa8c16',
        backgroundColor: '#ffffff',
        textColor: '#333333',
        fontFamily: 'Inter',
        fontSize: 14,
        borderRadius: 8,
        layoutWidth: 'contained',
        headerStyle: 'fixed',
      },
      security: {
        enableTwoFactor: true,
        passwordMinLength: 8,
        passwordRequireSpecialChar: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        enableCaptcha: true,
        enableSSL: true,
        ipWhitelist: [],
      },
      integrations: {
        googleAnalytics: 'UA-XXXXXXXXX-X',
        facebookPixel: '',
        stripePublishableKey: 'pk_test_...',
        stripeSecretKey: 'sk_test_...',
        paypalClientId: '',
        mailchimpApiKey: '',
        twilioAccountSid: '',
        twilioAuthToken: '',
        awsAccessKey: '',
        awsSecretKey: '',
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        orderConfirmation: true,
        shippingUpdates: true,
        inventoryAlerts: true,
        securityAlerts: true,
        marketingEmails: false,
      },
      advanced: {
        maintenanceMode: false,
        debugMode: false,
        cacheEnabled: true,
        compressionEnabled: true,
        minifyAssets: true,
        cookieConsent: true,
        gdprCompliance: true,
        customCSS: '',
        customJS: '',
        robotsTxt: 'User-agent: *\nDisallow:',
      },
    };

    setSettings(mockSettings);
    form.setFieldsValue(mockSettings);
  }, [form]);

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings(values);
      message.success('Settings saved successfully');
    } catch (error) {
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    Modal.confirm({
      title: 'Reset Settings',
      content: 'Are you sure you want to reset all settings to default values?',
      onOk: () => {
        form.resetFields();
        message.success('Settings reset to defaults');
      },
    });
  };

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

  const integrationData = [
    {
      name: 'Google Analytics',
      description: 'Track website traffic and user behavior',
      status: settings?.integrations.googleAnalytics ? 'connected' : 'disconnected',
      icon: '📊',
    },
    {
      name: 'Stripe',
      description: 'Payment processing and checkout',
      status: settings?.integrations.stripePublishableKey ? 'connected' : 'disconnected',
      icon: '💳',
    },
    {
      name: 'PayPal',
      description: 'Alternative payment gateway',
      status: settings?.integrations.paypalClientId ? 'connected' : 'disconnected',
      icon: '🏦',
    },
    {
      name: 'Mailchimp',
      description: 'Email marketing and newsletters',
      status: settings?.integrations.mailchimpApiKey ? 'connected' : 'disconnected',
      icon: '✉️',
    },
    {
      name: 'Twilio',
      description: 'SMS notifications and communication',
      status: settings?.integrations.twilioAccountSid ? 'connected' : 'disconnected',
      icon: '📱',
    },
    {
      name: 'AWS S3',
      description: 'Cloud storage for media files',
      status: settings?.integrations.awsAccessKey ? 'connected' : 'disconnected',
      icon: '☁️',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">Site Settings</Title>
          <Paragraph className="text-gray-600">
            Configure global settings for your e-commerce platform
          </Paragraph>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={() => form.submit()}
            size="large"
          >
            Save Changes
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        className="bg-white"
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          {/* General Settings */}
          <TabPane tab={<span><GlobalOutlined /> General</span>} key="general">
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
                      <Form.Item name={['general', 'timezone']} label="Timezone">
                        <Select placeholder="Select timezone">
                          <Option value="America/New_York">Eastern Time</Option>
                          <Option value="America/Chicago">Central Time</Option>
                          <Option value="America/Denver">Mountain Time</Option>
                          <Option value="America/Los_Angeles">Pacific Time</Option>
                          <Option value="UTC">UTC</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['general', 'language']} label="Language">
                        <Select placeholder="Select language">
                          <Option value="en">English</Option>
                          <Option value="es">Spanish</Option>
                          <Option value="fr">French</Option>
                          <Option value="de">German</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['general', 'currency']} label="Currency">
                        <Select placeholder="Select currency">
                          <Option value="USD">USD - US Dollar</Option>
                          <Option value="EUR">EUR - Euro</Option>
                          <Option value="GBP">GBP - British Pound</Option>
                          <Option value="CAD">CAD - Canadian Dollar</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['general', 'dateFormat']} label="Date Format">
                        <Select placeholder="Select date format">
                          <Option value="MM/dd/yyyy">MM/dd/yyyy</Option>
                          <Option value="dd/MM/yyyy">dd/MM/yyyy</Option>
                          <Option value="yyyy-MM-dd">yyyy-MM-dd</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
              
              <Col xs={24} lg={8}>
                <Card title="Contact Information">
                  <Form.Item name={['contact', 'email']} label="Email">
                    <Input prefix={<MailOutlined />} />
                  </Form.Item>
                  <Form.Item name={['contact', 'phone']} label="Phone">
                    <Input />
                  </Form.Item>
                  <Form.Item name={['contact', 'address']} label="Address">
                    <TextArea rows={2} />
                  </Form.Item>
                  <Row gutter={[8, 0]}>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['contact', 'city']} label="City">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['contact', 'state']} label="State">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[8, 0]}>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['contact', 'zipCode']} label="ZIP Code">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['contact', 'country']} label="Country">
                        <Select>
                          <Option value="United States">United States</Option>
                          <Option value="Canada">Canada</Option>
                          <Option value="United Kingdom">United Kingdom</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* E-commerce Settings */}
          <TabPane tab={<span><ShoppingOutlined /> E-commerce</span>} key="ecommerce">
            <Row gutter={[24, 0]}>
              <Col xs={24} lg={12}>
                <Card title="Order & Checkout" className="mb-6">
                  <Form.Item name={['ecommerce', 'defaultTaxRate']} label="Default Tax Rate (%)">
                    <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
                  </Form.Item>
                  
                  <Form.Item name={['ecommerce', 'freeShippingThreshold']} label="Free Shipping Threshold ($)">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                  
                  <Divider />
                  
                  <Form.Item name={['ecommerce', 'allowGuestCheckout']} valuePropName="checked">
                    <Switch /> Allow guest checkout
                  </Form.Item>
                  
                  <Form.Item name={['ecommerce', 'requireAccountVerification']} valuePropName="checked">
                    <Switch /> Require email verification for new accounts
                  </Form.Item>
                </Card>
              </Col>
              
              <Col xs={24} lg={12}>
                <Card title="Inventory Management">
                  <Form.Item name={['ecommerce', 'inventoryManagement']} valuePropName="checked">
                    <Switch /> Enable inventory tracking
                  </Form.Item>
                  
                  <Form.Item name={['ecommerce', 'backorderEnabled']} valuePropName="checked">
                    <Switch /> Allow backorders
                  </Form.Item>
                  
                  <Form.Item name={['ecommerce', 'lowStockThreshold']} label="Low Stock Threshold">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                  
                  <Form.Item name={['ecommerce', 'outOfStockVisibility']} valuePropName="checked">
                    <Switch /> Show out-of-stock products
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Theme Settings */}
          <TabPane tab={<span><PaletteOutlined /> Theme</span>} key="theme">
            <Row gutter={[24, 0]}>
              <Col xs={24} lg={12}>
                <Card title="Colors" className="mb-6">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['theme', 'primaryColor']} label="Primary Color">
                        <ColorPicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['theme', 'secondaryColor']} label="Secondary Color">
                        <ColorPicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['theme', 'accentColor']} label="Accent Color">
                        <ColorPicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['theme', 'backgroundColor']} label="Background Color">
                        <ColorPicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
                
                <Card title="Typography">
                  <Form.Item name={['theme', 'fontFamily']} label="Font Family">
                    <Select>
                      <Option value="Inter">Inter</Option>
                      <Option value="Roboto">Roboto</Option>
                      <Option value="Open Sans">Open Sans</Option>
                      <Option value="Lato">Lato</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item name={['theme', 'fontSize']} label="Base Font Size (px)">
                    <InputNumber min={12} max={20} style={{ width: '100%' }} />
                  </Form.Item>
                </Card>
              </Col>
              
              <Col xs={24} lg={12}>
                <Card title="Layout">
                  <Form.Item name={['theme', 'layoutWidth']} label="Layout Width">
                    <Select>
                      <Option value="full">Full Width</Option>
                      <Option value="contained">Contained</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item name={['theme', 'headerStyle']} label="Header Style">
                    <Select>
                      <Option value="fixed">Fixed</Option>
                      <Option value="static">Static</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item name={['theme', 'borderRadius']} label="Border Radius (px)">
                    <InputNumber min={0} max={20} style={{ width: '100%' }} />
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Security Settings */}
          <TabPane tab={<span><SafetyOutlined /> Security</span>} key="security">
            <Row gutter={[24, 0]}>
              <Col xs={24} lg={12}>
                <Card title="Authentication" className="mb-6">
                  <Form.Item name={['security', 'enableTwoFactor']} valuePropName="checked">
                    <Switch /> Enable two-factor authentication
                  </Form.Item>
                  
                  <Form.Item name={['security', 'passwordMinLength']} label="Minimum Password Length">
                    <InputNumber min={6} max={50} style={{ width: '100%' }} />
                  </Form.Item>
                  
                  <Form.Item name={['security', 'passwordRequireSpecialChar']} valuePropName="checked">
                    <Switch /> Require special characters in passwords
                  </Form.Item>
                  
                  <Form.Item name={['security', 'sessionTimeout']} label="Session Timeout (minutes)">
                    <InputNumber min={5} max={480} style={{ width: '100%' }} />
                  </Form.Item>
                </Card>
              </Col>
              
              <Col xs={24} lg={12}>
                <Card title="Protection">
                  <Form.Item name={['security', 'maxLoginAttempts']} label="Max Login Attempts">
                    <InputNumber min={3} max={10} style={{ width: '100%' }} />
                  </Form.Item>
                  
                  <Form.Item name={['security', 'enableCaptcha']} valuePropName="checked">
                    <Switch /> Enable CAPTCHA verification
                  </Form.Item>
                  
                  <Form.Item name={['security', 'enableSSL']} valuePropName="checked">
                    <Switch /> Force SSL/HTTPS
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Integrations */}
          <TabPane tab={<span><ApiOutlined /> Integrations</span>} key="integrations">
            <Row gutter={[24, 0]}>
              <Col xs={24} lg={16}>
                <Card title="API Keys & Integrations" className="mb-6">
                  <Alert
                    message="Security Notice"
                    description="Keep your API keys secure and never share them publicly. Use environment variables in production."
                    type="warning"
                    className="mb-4"
                  />
                  
                  <Row gutter={[16, 0]}>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['integrations', 'googleAnalytics']} label="Google Analytics ID">
                        <Input placeholder="UA-XXXXXXXXX-X" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['integrations', 'facebookPixel']} label="Facebook Pixel ID">
                        <Input placeholder="1234567890123456" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Divider>Payment Gateways</Divider>
                  
                  <Row gutter={[16, 0]}>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['integrations', 'stripePublishableKey']} label="Stripe Publishable Key">
                        <Input.Password placeholder="pk_test_..." />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['integrations', 'stripeSecretKey']} label="Stripe Secret Key">
                        <Input.Password placeholder="sk_test_..." />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item name={['integrations', 'paypalClientId']} label="PayPal Client ID">
                    <Input.Password />
                  </Form.Item>
                  
                  <Divider>Communication</Divider>
                  
                  <Form.Item name={['integrations', 'mailchimpApiKey']} label="Mailchimp API Key">
                    <Input.Password />
                  </Form.Item>
                  
                  <Row gutter={[16, 0]}>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['integrations', 'twilioAccountSid']} label="Twilio Account SID">
                        <Input.Password />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['integrations', 'twilioAuthToken']} label="Twilio Auth Token">
                        <Input.Password />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
              
              <Col xs={24} lg={8}>
                <Card title="Integration Status">
                  <List
                    dataSource={integrationData}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar>{item.icon}</Avatar>}
                          title={item.name}
                          description={item.description}
                        />
                        <Tag color={item.status === 'connected' ? 'green' : 'red'}>
                          {item.status}
                        </Tag>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Notifications */}
          <TabPane tab={<span><BellOutlined /> Notifications</span>} key="notifications">
            <Row gutter={[24, 0]}>
              <Col xs={24} lg={12}>
                <Card title="Notification Channels" className="mb-6">
                  <Form.Item name={['notifications', 'emailNotifications']} valuePropName="checked">
                    <Switch /> Email notifications
                  </Form.Item>
                  
                  <Form.Item name={['notifications', 'smsNotifications']} valuePropName="checked">
                    <Switch /> SMS notifications
                  </Form.Item>
                  
                  <Form.Item name={['notifications', 'pushNotifications']} valuePropName="checked">
                    <Switch /> Push notifications
                  </Form.Item>
                </Card>
              </Col>
              
              <Col xs={24} lg={12}>
                <Card title="Notification Types">
                  <Form.Item name={['notifications', 'orderConfirmation']} valuePropName="checked">
                    <Switch /> Order confirmations
                  </Form.Item>
                  
                  <Form.Item name={['notifications', 'shippingUpdates']} valuePropName="checked">
                    <Switch /> Shipping updates
                  </Form.Item>
                  
                  <Form.Item name={['notifications', 'inventoryAlerts']} valuePropName="checked">
                    <Switch /> Inventory alerts
                  </Form.Item>
                  
                  <Form.Item name={['notifications', 'securityAlerts']} valuePropName="checked">
                    <Switch /> Security alerts
                  </Form.Item>
                  
                  <Form.Item name={['notifications', 'marketingEmails']} valuePropName="checked">
                    <Switch /> Marketing emails
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Advanced Settings */}
          <TabPane tab={<span><SettingOutlined /> Advanced</span>} key="advanced">
            <Row gutter={[24, 0]}>
              <Col xs={24} lg={12}>
                <Card title="System Settings" className="mb-6">
                  <Form.Item name={['advanced', 'maintenanceMode']} valuePropName="checked">
                    <Switch /> Maintenance mode
                  </Form.Item>
                  
                  <Form.Item name={['advanced', 'debugMode']} valuePropName="checked">
                    <Switch /> Debug mode
                  </Form.Item>
                  
                  <Form.Item name={['advanced', 'cacheEnabled']} valuePropName="checked">
                    <Switch /> Enable caching
                  </Form.Item>
                  
                  <Form.Item name={['advanced', 'compressionEnabled']} valuePropName="checked">
                    <Switch /> Enable compression
                  </Form.Item>
                  
                  <Form.Item name={['advanced', 'minifyAssets']} valuePropName="checked">
                    <Switch /> Minify CSS/JS assets
                  </Form.Item>
                </Card>
                
                <Card title="Compliance">
                  <Form.Item name={['advanced', 'cookieConsent']} valuePropName="checked">
                    <Switch /> Cookie consent banner
                  </Form.Item>
                  
                  <Form.Item name={['advanced', 'gdprCompliance']} valuePropName="checked">
                    <Switch /> GDPR compliance mode
                  </Form.Item>
                </Card>
              </Col>
              
              <Col xs={24} lg={12}>
                <Card title="Custom Code">
                  <Form.Item name={['advanced', 'customCSS']} label="Custom CSS">
                    <TextArea
                      rows={8}
                      placeholder="/* Add your custom CSS here */"
                      style={{ fontFamily: 'monospace' }}
                    />
                  </Form.Item>
                  
                  <Form.Item name={['advanced', 'customJS']} label="Custom JavaScript">
                    <TextArea
                      rows={8}
                      placeholder="// Add your custom JavaScript here"
                      style={{ fontFamily: 'monospace' }}
                    />
                  </Form.Item>
                  
                  <Form.Item name={['advanced', 'robotsTxt']} label="Robots.txt">
                    <TextArea
                      rows={4}
                      placeholder="User-agent: *&#10;Disallow:"
                      style={{ fontFamily: 'monospace' }}
                    />
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Form>
    </div>
  );
};

export default SiteSettings;
