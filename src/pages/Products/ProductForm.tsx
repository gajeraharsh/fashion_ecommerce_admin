import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Select,
  InputNumber,
  Upload,
  Switch,
  Tag,
  Divider,
  Space,
  Table,
  Modal,
  App,
  Tabs,
  Collapse,
  AutoComplete,
  DatePicker,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  TagsOutlined,
  SettingOutlined,
  SearchOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addProduct, updateProduct } from '../../store/slices/productSlice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Option } = Select;
const { TextArea } = Input;
// Tabs converted to items format
const { Panel } = Collapse;

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
  price: number;
  discount: number;
  images: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  subcategory: string;
  brand: string;
  variants: ProductVariant[];
  tags: string[];
  status: 'draft' | 'live' | 'out_of_stock';
  seo: {
    title: string;
    description: string;
    url: string;
    keywords: string[];
  };
  attributes: {
    material: string;
    fit: string;
    fabric: string;
    careInstructions: string;
    origin: string;
  };
  faqs: Array<{ question: string; answer: string }>;
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    freeShipping: boolean;
    shippingClass: string;
  };
  inventory: {
    trackInventory: boolean;
    allowBackorders: boolean;
    lowStockThreshold: number;
  };
  pricing: {
    costPrice: number;
    markupPercentage: number;
    taxable: boolean;
    taxClass: string;
  };
  visibility: {
    featured: boolean;
    visibleInCatalog: boolean;
    visibleInSearch: boolean;
    publishDate?: string;
  };
}

const ProductForm: React.FC = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { products, categories } = useSelector((state: RootState) => state.products);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantModalVisible, setVariantModalVisible] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [variantForm] = Form.useForm();
  const [tags, setTags] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);
  const [description, setDescription] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      const product = products.find(p => p.id === id);
      if (product) {
        form.setFieldsValue({
          ...product,
          publishDate: product.visibility?.publishDate ? new Date(product.visibility.publishDate) : null,
        });
        setVariants(product.variants || []);
        setTags(product.tags || []);
        setFaqs(product.faqs || []);
        setDescription(product.description || '');
      }
    }
  }, [id, isEditing, products, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const productData: ProductFormData = {
        ...values,
        id: isEditing ? id : Date.now().toString(),
        variants,
        tags,
        faqs,
        description,
        createdAt: isEditing ? products.find(p => p.id === id)?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isEditing) {
        dispatch(updateProduct(productData as any));
        message.success('Product updated successfully');
      } else {
        dispatch(addProduct(productData as any));
        message.success('Product created successfully');
      }

      navigate('/products');
    } catch (error) {
      message.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVariant = () => {
    setEditingVariant(null);
    variantForm.resetFields();
    setVariantModalVisible(true);
  };

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    variantForm.setFieldsValue(variant);
    setVariantModalVisible(true);
  };

  const handleSaveVariant = (values: any) => {
    const variantData: ProductVariant = {
      ...values,
      id: editingVariant?.id || Date.now().toString(),
      images: values.images?.fileList?.map((file: any) => file.url || file.response?.url) || [],
    };

    if (editingVariant) {
      setVariants(variants.map(v => v.id === editingVariant.id ? variantData : v));
    } else {
      setVariants([...variants, variantData]);
    }

    setVariantModalVisible(false);
    message.success('Variant saved successfully');
  };

  const handleDeleteVariant = (variantId: string) => {
    setVariants(variants.filter(v => v.id !== variantId));
    message.success('Variant deleted successfully');
  };

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (removedTag: string) => {
    setTags(tags.filter(tag => tag !== removedTag));
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const variantColumns = [
    {
      title: 'Image',
      key: 'image',
      render: (record: ProductVariant) => (
        <img
          src={record.images[0] || 'https://via.placeholder.com/50'}
          alt="variant"
          className="w-12 h-12 object-cover rounded"
        />
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => <Tag color={color.toLowerCase()}>{color}</Tag>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
          {stock}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: ProductVariant) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditVariant(record)} />
          <Button 
            size="small" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteVariant(record.id)}
          />
        </Space>
      ),
    },
  ];

  const quillModules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h1>
        <Space>
          <Button onClick={() => setPreviewVisible(true)} icon={<EyeOutlined />}>
            Preview
          </Button>
          <Button onClick={() => navigate('/products')}>Cancel</Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'draft',
          visibility: {
            featured: false,
            visibleInCatalog: true,
            visibleInSearch: true,
          },
          inventory: {
            trackInventory: true,
            allowBackorders: false,
            lowStockThreshold: 5,
          },
          shipping: {
            freeShipping: false,
            shippingClass: 'standard',
          },
          pricing: {
            markupPercentage: 50,
            taxable: true,
            taxClass: 'standard',
          },
        }}
      >
        <Tabs defaultActiveKey="basic" type="card" items={[
          {
            key: 'basic',
            label: 'Basic Information',
            children: (
            <Row gutter={[24, 0]}>
              <Col xs={24} lg={16}>
                <Card title="Product Details" className="mb-6">
                  <Form.Item
                    name="name"
                    label="Product Name"
                    rules={[{ required: true, message: 'Please enter product name' }]}
                  >
                    <Input size="large" placeholder="Enter product name" />
                  </Form.Item>

                  <Form.Item name="shortDescription" label="Short Description">
                    <TextArea rows={3} placeholder="Brief description for listings" />
                  </Form.Item>

                  <Form.Item name="description" label="Full Description">
                    <ReactQuill
                      theme="snow"
                      value={description}
                      onChange={setDescription}
                      modules={quillModules}
                      formats={quillFormats}
                      style={{ height: '200px', marginBottom: '50px' }}
                    />
                  </Form.Item>

                  <Row gutter={[16, 0]}>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please select category' }]}
                      >
                        <Select placeholder="Select category">
                          {categories.map(cat => (
                            <Option key={cat} value={cat}>{cat}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        name="subcategory"
                        label="Subcategory"
                        rules={[{ required: true, message: 'Please enter subcategory' }]}
                      >
                        <Input placeholder="e.g., Dresses, Shirts" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item name="brand" label="Brand">
                        <Input placeholder="Brand name" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="Tags">
                    <div className="mb-2">
                      <Input
                        placeholder="Add tags (press Enter to add)"
                        onPressEnter={(e) => {
                          const value = (e.target as HTMLInputElement).value.trim();
                          if (value) {
                            handleAddTag(value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                        style={{ width: '200px', marginRight: '8px' }}
                      />
                      <Button
                        type="dashed"
                        icon={<TagsOutlined />}
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Add tags (press Enter to add)"]') as HTMLInputElement;
                          if (input?.value.trim()) {
                            handleAddTag(input.value.trim());
                            input.value = '';
                          }
                        }}
                      >
                        Add Tag
                      </Button>
                    </div>
                    <div>
                      {tags.map(tag => (
                        <Tag
                          key={tag}
                          closable
                          onClose={() => handleRemoveTag(tag)}
                          className="mb-1"
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </Form.Item>
                </Card>

                {/* Product Attributes */}
                <Card title="Product Attributes" className="mb-6">
                  <Row gutter={[16, 0]}>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['attributes', 'material']} label="Material">
                        <Input placeholder="e.g., Cotton, Silk, Leather" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['attributes', 'fit']} label="Fit">
                        <Select placeholder="Select fit">
                          <Option value="slim">Slim</Option>
                          <Option value="regular">Regular</Option>
                          <Option value="loose">Loose</Option>
                          <Option value="oversized">Oversized</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['attributes', 'fabric']} label="Fabric">
                        <Input placeholder="e.g., Premium, Soft, Durable" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['attributes', 'origin']} label="Country of Origin">
                        <Input placeholder="e.g., Made in USA" />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item name={['attributes', 'careInstructions']} label="Care Instructions">
                        <TextArea rows={2} placeholder="e.g., Machine wash cold, tumble dry low" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                {/* Product Status */}
                <Card title="Product Status" className="mb-6">
                  <Form.Item name="status" label="Status">
                    <Select>
                      <Option value="draft">Draft</Option>
                      <Option value="live">Live</Option>
                      <Option value="out_of_stock">Out of Stock</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name={['visibility', 'featured']} valuePropName="checked">
                    <Switch /> Featured Product
                  </Form.Item>

                  <Form.Item name={['visibility', 'visibleInCatalog']} valuePropName="checked">
                    <Switch defaultChecked /> Visible in Catalog
                  </Form.Item>

                  <Form.Item name={['visibility', 'visibleInSearch']} valuePropName="checked">
                    <Switch defaultChecked /> Visible in Search
                  </Form.Item>

                  <Form.Item name={['visibility', 'publishDate']} label="Publish Date">
                    <DatePicker showTime style={{ width: '100%' }} />
                  </Form.Item>
                </Card>

                {/* Inventory Settings */}
                <Card title="Inventory" className="mb-6">
                  <Form.Item name={['inventory', 'trackInventory']} valuePropName="checked">
                    <Switch defaultChecked /> Track Inventory
                  </Form.Item>

                  <Form.Item name={['inventory', 'allowBackorders']} valuePropName="checked">
                    <Switch /> Allow Backorders
                  </Form.Item>

                  <Form.Item name={['inventory', 'lowStockThreshold']} label="Low Stock Threshold">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Card>

                {/* Pricing */}
                <Card title="Pricing" className="mb-6">
                  <Form.Item name={['pricing', 'costPrice']} label="Cost Price">
                    <InputNumber
                      min={0}
                      precision={2}
                      prefix="$"
                      style={{ width: '100%' }}
                      placeholder="0.00"
                    />
                  </Form.Item>

                  <Form.Item name={['pricing', 'markupPercentage']} label="Markup %">
                    <InputNumber
                      min={0}
                      max={1000}
                      suffix="%"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item name={['pricing', 'taxable']} valuePropName="checked">
                    <Switch defaultChecked /> Taxable
                  </Form.Item>

                  <Form.Item name={['pricing', 'taxClass']} label="Tax Class">
                    <Select>
                      <Option value="standard">Standard</Option>
                      <Option value="reduced">Reduced Rate</Option>
                      <Option value="zero">Zero Rate</Option>
                    </Select>
                  </Form.Item>
                </Card>
              </Col>
            </Row>
            ),
          },
          {
            key: 'variants',
            label: 'Variants',
            children: (
            <Card
              title="Product Variants"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddVariant}
                >
                  Add Variant
                </Button>
              }
            >
              <Table
                columns={variantColumns}
                dataSource={variants}
                rowKey="id"
                pagination={false}
                locale={{ emptyText: 'No variants added yet' }}
              />
            </Card>
            ),
          },
          {
            key: 'seo',
            label: 'SEO',
            children: (
            <Card title="Search Engine Optimization">
              <Form.Item
                name={['seo', 'title']}
                label="SEO Title"
                extra="Recommended length: 50-60 characters"
              >
                <Input placeholder="Enter SEO title" maxLength={60} showCount />
              </Form.Item>

              <Form.Item
                name={['seo', 'description']}
                label="Meta Description"
                extra="Recommended length: 150-160 characters"
              >
                <TextArea
                  rows={3}
                  placeholder="Enter meta description"
                  maxLength={160}
                  showCount
                />
              </Form.Item>

              <Form.Item
                name={['seo', 'url']}
                label="URL Slug"
                extra="This will be used in the product URL"
              >
                <Input
                  placeholder="product-url-slug"
                  addonBefore="fashion.com/products/"
                />
              </Form.Item>

              <Form.Item name={['seo', 'keywords']} label="Keywords">
                <Select
                  mode="tags"
                  placeholder="Enter keywords"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Card>
            ),
          },
          {
            key: 'shipping',
            label: 'Shipping',
            children: (
            <Card title="Shipping Information">
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item name={['shipping', 'weight']} label="Weight (kg)">
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name={['shipping', 'shippingClass']} label="Shipping Class">
                    <Select>
                      <Option value="standard">Standard</Option>
                      <Option value="express">Express</Option>
                      <Option value="overnight">Overnight</Option>
                      <Option value="heavy">Heavy Item</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col xs={24} sm={8}>
                  <Form.Item name={['shipping', 'dimensions', 'length']} label="Length (cm)">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name={['shipping', 'dimensions', 'width']} label="Width (cm)">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name={['shipping', 'dimensions', 'height']} label="Height (cm)">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name={['shipping', 'freeShipping']} valuePropName="checked">
                <Switch /> Free Shipping
              </Form.Item>
            </Card>
            ),
          },
          {
            key: 'faqs',
            label: 'FAQs',
            children: (
            <Card
              title="Frequently Asked Questions"
              extra={
                <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddFaq}>
                  Add FAQ
                </Button>
              }
            >
              {faqs.map((faq, index) => (
                <Card key={index} size="small" className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-base font-medium">FAQ {index + 1}</h4>
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveFaq(index)}
                    />
                  </div>
                  <Input
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)}
                    className="mb-2"
                  />
                  <TextArea
                    rows={2}
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)}
                  />
                </Card>
              ))}
              {faqs.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No FAQs added yet. Click "Add FAQ" to get started.
                </div>
              )}
            </Card>
            ),
          },
        ]} />

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-2 pt-6 border-t">
          <Button size="large" onClick={() => navigate('/products')}>
            Cancel
          </Button>
          <Button
            type="default"
            size="large"
            onClick={() => form.setFieldsValue({ status: 'draft' })}
            htmlType="submit"
            loading={loading}
          >
            Save as Draft
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            htmlType="submit"
            loading={loading}
          >
            {isEditing ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </Form>

      {/* Variant Modal */}
      <Modal
        title={editingVariant ? 'Edit Variant' : 'Add Variant'}
        open={variantModalVisible}
        onCancel={() => setVariantModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={variantForm}
          layout="vertical"
          onFinish={handleSaveVariant}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="sku"
                label="SKU"
                rules={[{ required: true, message: 'Please enter SKU' }]}
              >
                <Input placeholder="e.g., DRS-BLK-M" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="size"
                label="Size"
                rules={[{ required: true, message: 'Please enter size' }]}
              >
                <Input placeholder="e.g., M, L, XL" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="color"
                label="Color"
                rules={[{ required: true, message: 'Please enter color' }]}
              >
                <Input placeholder="e.g., Black, White" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="stock"
                label="Stock Quantity"
                rules={[{ required: true, message: 'Please enter stock' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
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
            <Col xs={24} sm={12}>
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
              
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={8}>
                  <Form.Item name={['dimensions', 'length']} label="Length (cm)">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name={['dimensions', 'width']} label="Width (cm)">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name={['dimensions', 'height']} label="Height (cm)">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
          </Collapse>

          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => setVariantModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingVariant ? 'Update Variant' : 'Add Variant'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductForm;
