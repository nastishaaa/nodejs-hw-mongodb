export const notFoundHandler = (req, res ) => {
    res.status(404).json({
        status: 404,
        message: 'Not found',
        data: `Cannot ${req.method} ${req.originalUrl}`,
    });
};
