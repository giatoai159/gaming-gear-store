const {models} = require('../../models');
const sequelize = require('sequelize');

// Product List Page
const pageValidation = (page) => {
    page = isNaN(page) ? 0 : Number(page);
    page = page >= 0 ? page : 0;
    return page;
}

const getAllProducts = (categoryId, page = 0,itemsPerPage = 9) => {
    let where = {};
    if (!isNaN(categoryId)) {
        where = {category:categoryId};
    }
    return models.product.findAndCountAll({
        offset: page * itemsPerPage,
        limit: itemsPerPage,
        where,
        raw : true,
        attributes: ['idProduct', 'name', 'brand', 'price','thumbnail'],
        include : [
            {model:models.category, attributes: ['nameCategory'], as: 'category_category'},
        ],
    });
};

const getProductBrandsCount = () => {
    return models.product.findAll({
        attributes: ['brand',[sequelize.fn('COUNT',sequelize.col('brand')),'numProducts']],
        group: ['brand'],
        raw: true,
    })
}

const getProductCategoriesCount = () => {
    return models.product.findAll({
        include : [{
            model:models.category, attributes: ['nameCategory'], as: 'category_category',
            },
        ],
        attributes: ['category',[sequelize.fn('COUNT',sequelize.col('category')),'numProducts']],
        group: ['category'],
        raw: true,
    })
}
// Product Details Page
const getDetails = (id) => {
    return models.product.findOne({
        where: {
            idProduct: id,
        },
        raw : true,
        include : [{
                model:models.category, attributes: ['nameCategory'], as: 'category_category',
            },
        ],
    });
}

const getDetailImages = (id) => {
    return models.product_images.findAll({
        where: {
            product: id,
        },
        raw : true,
    });
}

const getDetailComments = (id, page = 0) => {
    return models.product_comments.findAndCountAll({
        offset: page * 3,
        limit: 3,
        attributes: ['content','rating',[sequelize.fn('date_format', sequelize.col('creationAt'), '%d %b %Y, %h:%i %p'), 'creationAt']],
        include: [{
            model: models.account,
            attributes: ['name'],
            as: 'idAccount_account'
        }],
        where: {
            idProduct: id,
        },
        raw: true,
    })
}

const getDetailsCommentsCount = (id) => {
    return models.product_comments.findAll({
        where: {
            idProduct: id,
        },
        attributes: ['rating',[sequelize.fn('COUNT',sequelize.col('rating')),'ratingcount']],
        group: ['rating'],
        raw: true,
    })
}

const getDetailRelatedProducts = (id, idCategory) => {
    return models.product.findAll({
        where: {
            idProduct: {
                [sequelize.Op.not]: id
            },
            category: idCategory
        },
        attributes: ['idProduct','name','price','brand','thumbnail'],
        raw: true,
        limit: 4,
        include : [{
            model:models.category, attributes: ['nameCategory'], as: 'category_category',
        },
    ],
    })
}

module.exports = {
    pageValidation,
    getAllProducts,
    getProductBrandsCount,
    getProductCategoriesCount,
    getDetails,
    getDetailImages,
    getDetailComments,
    getDetailsCommentsCount,
    getDetailRelatedProducts,
};