const express = require('express');
const auth = require('../../middlewares/auth');
const contactController = require('../../controllers/contact.controller');

const router = express.Router();

router
    .route('/')
    .post(contactController.submitContact)
    .get(auth('manageContact'), contactController.getAllContacts);
router.get('/:contactId', auth('manageContact'), contactController.getContactById);

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contact management and retrieval
 */

/**
 * @swagger
 * path:
 *  /contacts:
 *    post:
 *      summary: Create a contact
 *      tags: [Contacts]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - name
 *                - email
 *                - phone
 *                - comment
 *              properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                  description: must be unique
 *                phone:
 *                  type: string
 *                comment:  
 *                  type: string
 *              example:
 *                name: fake name
 *                email: fake_email@me.com
 *                phone: 0123456789
 *                comment: fake comment
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Contact'
 *        "400":    
 *          $ref: '#/components/responses/DuplicateEmail'
 * 
 *    get:
 *      summary: Get all contacts
 *      tags: [Contacts]
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Contact'
 */

/**
 * @swagger
 * path:
 *  /contacts/{id}:
 *    get:
 *      summary: Get a contact
 *      tags: [Contacts]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Contact id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Contact'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */