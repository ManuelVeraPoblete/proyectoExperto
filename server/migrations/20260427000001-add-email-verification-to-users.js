'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('user');

    if (!tableDesc.emailVerified) {
      await queryInterface.addColumn('user', 'emailVerified', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      });
    }

    if (!tableDesc.emailVerificationToken) {
      await queryInterface.addColumn('user', 'emailVerificationToken', {
        type: Sequelize.STRING(64),
        allowNull: true,
      });
    }

    if (!tableDesc.emailVerificationExpires) {
      await queryInterface.addColumn('user', 'emailVerificationExpires', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('user', 'emailVerified');
    await queryInterface.removeColumn('user', 'emailVerificationToken');
    await queryInterface.removeColumn('user', 'emailVerificationExpires');
  },
};
