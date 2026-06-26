import { getAllProducts } from '../data';

const GALLERY_TO_PRODUCT: Record<string, string> = {
  'Wyze Cam v4': 'wyze-cam-v4',
  'Wyze Cam Pan v3': 'wyze-cam-pan-v3',
  'Wyze Cam Floodlight v2': 'wyze-cam-floodlight-v2',
  'Wyze Duo Cam Doorbell': 'wyze-duo-cam-doorbell',
  'Wyze Battery Cam Pro': 'wyze-battery-cam-pro',
};

const EXPECTED_IMAGE_BY_PRODUCT_ID: Record<string, string> = {
  'wyze-cam-v4': '/products/wyze-cam-v4.png',
  'wyze-cam-pan-v3': '/products/wyze-cam-pan-v3.png',
  'wyze-cam-floodlight-v2': '/products/wyze-cam-floodlight-v2.png',
  'wyze-duo-cam-doorbell': '/products/wyze-duo-cam-doorbell.png',
  'wyze-battery-cam-pro': '/products/wyze-battery-cam-pro.png',
};

export function verifyCameraImageWiring() {
  const cameraProducts = getAllProducts().filter(
    (product) => product.category === 'cameras',
  );
  const issues: string[] = [];
  const mappings: Array<{ title: string; productId: string; image: string }> = [];

  for (const product of cameraProducts) {
    const expectedImage = EXPECTED_IMAGE_BY_PRODUCT_ID[product.id];

    mappings.push({
      title: product.title,
      productId: product.id,
      image: product.image ?? '',
    });

    if (!product.image) {
      issues.push(`${product.title}: missing image path`);
      continue;
    }

    if (product.image !== expectedImage) {
      issues.push(
        `${product.title}: expected ${expectedImage}, got ${product.image}`,
      );
    }
  }

  for (const [galleryTitle, productId] of Object.entries(GALLERY_TO_PRODUCT)) {
    const product = cameraProducts.find((item) => item.id === productId);
    if (!product) {
      issues.push(`${galleryTitle}: no matching product in bundle data`);
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    mappings,
    galleryToProduct: GALLERY_TO_PRODUCT,
  };
}
