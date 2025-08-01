import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  InputNumber,
  Upload,
  Collapse,
  App,
  PageHeader,
} from 'antd';
import {
  SaveOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const { Panel } = Collapse;

interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  discount?: number;
  images: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

const VariantForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [variant, setVariant] = useState<ProductVariant | null>(null);
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { productId, variantId } = useParams();
  const location = useLocation();
  const isEditing = !!variantId;
  
  // Get product name from navigation state
  const productName = location.state?.productName || 'Product';

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  useEffect(() => {
    if (isEditing) {
      // In a real app, fetch variant by ID from API
      const mockVariant: ProductVariant = {
        id: variantId!,
        sku: 'DRS-BLK-M',
        size: 'M',
        color: 'Black',
        stock: 50,
        price: 89.99,
        discount: 10,
        images: [],
        weight: 0.5,
        dimensions: {
          length: 30,
          width: 25,
          height: 2,
        },
      };
      
      setVariant(mockVariant);
      form.setFieldsValue(mockVariant);
    }
  }, [variantId, isEditing, form]);

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      const variantData = {
        ...values,
        id: variant?.id || `variant_${Date.now()}`,
        productId,
      };

      // In a real app, make API call here
      console.log('Saving variant:', variantData);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      message.success(isEditing ? 'Variant updated successfully' : 'Variant created successfully');
      navigate(`/products/edit/${productId}`, { 
        state: { 
          tab: 'variants',
          message: isEditing ? 'Variant updated successfully' : 'Variant added successfully'
        }
      });
    } catch (error) {
      message.error('Failed to save variant');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/products/edit/${productId}`, { state: { tab: 'variants' } });
  };

  return (
    <div className="p-6">
      <PageHeader
        onBack={handleCancel}
        title={isEditing ? 'Edit Variant' : 'Add Variant'}
        subTitle={`${productName} - ${isEditing ? `Editing variant: ${variant?.sku}` : 'Create a new product variant'}`}
        extra={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={() => form.submit()}
          >
            {isEditing ? 'Update Variant' : 'Add Variant'}
          </Button>,
        ]}
      />

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="sku"
                label="SKU"
                rules={[{ required: true, message: 'Please enter SKU' }]}
              >
                <Input placeholder="e.g., DRS-BLK-M" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="size"
                label="Size"
                rules={[{ required: true, message: 'Please enter size' }]}
              >
                <Input placeholder="e.g., M, L, XL" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 0]}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="color"
                label="Color"
                rules={[{ required: true, message: 'Please enter color' }]}
              >
                <Input placeholder="e.g., Black, White" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="stock"
                label="Stock Quantity"
                rules={[{ required: true, message: 'Please enter stock' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 0]}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <InputNumber
                  min={0}
                  precision={2}
                  prefix="$"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item name="discount" label="Discount %">
                <InputNumber
                  min={0}
                  max={100}
                  suffix="%"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="images" label="Variant Images">
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={{
                showPreviewIcon: true,
                showRemoveIcon: true,
              }}
              beforeUpload={() => false}
            >
              {uploadButton}
            </Upload>
          </Form.Item>

          <Collapse>
            <Panel header="Additional Details" key="1">
              <Form.Item name="weight" label="Weight (kg)">
                <InputNumber min={0} precision={2} style={{ width: '100%' }} />
              </Form.Item>
              
              <Row gutter={[24, 0]}>
                <Col xs={24} lg={8}>
                  <Form.Item name={['dimensions', 'length']} label="Length (cm)">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item name={['dimensions', 'width']} label="Width (cm)">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item name={['dimensions', 'height']} label="Height (cm)">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="material" label="Material">
                <Input placeholder="e.g., Cotton, Polyester" />
              </Form.Item>

              <Form.Item name="careInstructions" label="Care Instructions">
                <Input.TextArea 
                  rows={3} 
                  placeholder="e.g., Machine wash cold, tumble dry low" 
                />
              </Form.Item>
            </Panel>
          </Collapse>
        </Form>
      </Card>
    </div>
  );
};

export default VariantForm;
