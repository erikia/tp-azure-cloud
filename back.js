import express from 'express';
import multer, { memoryStorage } from 'multer';
import { post } from 'axios';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

const storage = memoryStorage();
const upload = multer({ storage: storage });

const app = express();

app.post('/api/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        res.status(400).send('No image uploaded.');
        return;
    }

    // Configuration Azure Key Vault
    const keyVaultName = "CoffreFortTpAzure";
    const keyVaultUri = `https://${keyVaultName}.vault.azure.net`;

    const credential = new DefaultAzureCredential();
    const secretClient = new SecretClient(keyVaultUri, credential);

    try {
        const imageUrlSecretName = "ImageUrlSecret"; 
        const imageUrl = await secretClient.getSecret(imageUrlSecretName).then((secret) => secret.value);


        const response = await post(imageUrl, req.file.buffer, {
            headers: {
                'Content-Type': 'application/octet-stream',
            },
        });

        const result = response.data;

        res.send({
            message: 'Image uploaded and processing initiated.',
            result: result,
        });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).send('Error processing image.');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
