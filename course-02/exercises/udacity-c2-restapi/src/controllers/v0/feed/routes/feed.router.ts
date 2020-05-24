import { Router, Request, Response } from 'express';
import { FeedItem } from '../models/FeedItem';
import { requireAuth } from '../../users/routes/auth.router';
import * as AWS from '../../../../aws';

const router: Router = Router();

// Get all feed items
router.get('/', 
    async (req: Request, res: Response) => {
        const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
        items.rows.map((item) => {
            if(item.url) {
                item.url = AWS.getGetSignedUrl(item.url);
            }
        });
    res.send(items);
    }
);

// Get specific feed item with an id
router.get('/:id', 
    requireAuth,
    async (req: Request, res: Response) => {
        const { id } = req.params;
        console.log(id);

        if(!id){
            return res.status(400).send("id is required");
        }

        const item = await FeedItem.findByPk(id);

        if (item) {
            res.status(200).send(item);
        }
        
        res.status(404).send('item is not found')
    }
);

// update a resource
router.patch('/:id',
    requireAuth,
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const { newCaption } = req.params;
        const { newUrl } = req.params;

        console.log(id);

        if(!id){return res.status(400).send("id is required");}
        if (!newCaption) {return res.status(400).send({message: 'caption is required'});}
        if (!newUrl) {return res.status(400).send({message: 'file url is required'});}

        const item = await FeedItem.findByPk(id);

        if (item) {
            item.set('updatedAt', new Date());
            item.url = newUrl;
            item.caption = newCaption;
            
            item.update({url: newUrl, caption: newCaption}).then(() => {
                console.log('Updated');
            });

            item.save().then(()=> {
                res.status(200).send("SUCCESS");
            }).error((error)=> {
                res.send(400).send(error);
            });
        }

        res.send(500).send("not implemented");
});


// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName', 
    requireAuth, 
    async (req: Request, res: Response) => {
    let { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({url: url});
});

// Post meta data and the filename after a file is uploaded 
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post('/', 
    requireAuth, 
    async (req: Request, res: Response) => {
    const caption = req.body.caption;
    const fileName = req.body.url;

    // check Caption is valid
    if (!caption) {
        return res.status(400).send({ message: 'Caption is required or malformed' });
    }

    // check Filename is valid
    if (!fileName) {
        return res.status(400).send({ message: 'File url is required' });
    }

    const item = await new FeedItem({
            caption: caption,
            url: fileName
    });

    const saved_item = await item.save();

    saved_item.url = AWS.getGetSignedUrl(saved_item.url);
    res.status(201).send(saved_item);
});

export const FeedRouter: Router = router;