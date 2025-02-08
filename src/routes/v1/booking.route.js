const express = require('express');
const auth = require('../../middlewares/auth');
const bookingController = require('../../controllers/booking.controller');

const router = express.Router();

router
    .route('/')
    .post(bookingController.createBooking)
    .get(auth('manageBooking'), bookingController.getAllBookings);
router.get('/:bookingId', auth('manageBooking'), bookingController.getBooking);

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management and retrieval
 */

/**
 * @swagger
 * path:
 *  /bookings:
 *    post:
 *      summary: Create a booking
 *      tags: [Bookings]
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
 *                type: object
 *                properties: 
 *                  booking:
 *                    $ref: '#/components/schemas/Booking'
 *        "400":
 *          $ref: '#/components/responses/DuplicateEmail'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    get:
 *      summary: Get all bookings
 *      tags: [Bookings]
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Booking'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * path:
 *  /bookings/{id}:
 *    get:
 *      summary: Get a booking
 *      tags: [Bookings]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Booking id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Booking'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */