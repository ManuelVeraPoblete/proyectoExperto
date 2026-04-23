'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('experto_profile', 'verificationStatus', {
      type: Sequelize.ENUM('pendiente', 'activo', 'anulado'),
      allowNull: false,
      defaultValue: 'pendiente',
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('experto_profile', 'verificationStatus');
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS `enum_experto_profile_verificationStatus`"
    );
  },
};
