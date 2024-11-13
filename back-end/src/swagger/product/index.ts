/**
 * @swagger
 * /v1/api/product/update/{productId}:
 *   patch:
 *     summary: Update product item
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "New Product"
 *                 price:
 *                   type: number
 *                   example: 39.99
 *       400:
 *         description: Bad Request - Invalid input.
 *       401:
 *         description: Unauthorized - Authentication credentials are missing or invalid.
 *       403:
 *         description: Forbidden - You do not have permission to perform this action.
 *       409:
 *         description: Conflict - The product already exists.
 *       500:
 *         description: Internal Server Error - Something went wrong on the server side.
 */
