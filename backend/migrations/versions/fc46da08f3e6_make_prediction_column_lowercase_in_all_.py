"""Make Prediction column lowercase in all the tables

Revision ID: fc46da08f3e6
Revises: 42259b5ead35
Create Date: 2024-06-03 18:16:58.222657

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fc46da08f3e6'
down_revision = '42259b5ead35'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('film', schema=None) as batch_op:
        batch_op.add_column(sa.Column('finished', sa.Integer(), nullable=True))
        batch_op.drop_column('Finished')

    with op.batch_alter_table('opinion', schema=None) as batch_op:
        batch_op.add_column(sa.Column('finished', sa.Integer(), nullable=True))
        batch_op.drop_column('Finished')

    with op.batch_alter_table('prediction', schema=None) as batch_op:
        batch_op.add_column(sa.Column('finished', sa.Integer(), nullable=True))
        batch_op.drop_column('Finished')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('prediction', schema=None) as batch_op:
        batch_op.add_column(sa.Column('Finished', sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.drop_column('finished')

    with op.batch_alter_table('opinion', schema=None) as batch_op:
        batch_op.add_column(sa.Column('Finished', sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.drop_column('finished')

    with op.batch_alter_table('film', schema=None) as batch_op:
        batch_op.add_column(sa.Column('Finished', sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.drop_column('finished')

    # ### end Alembic commands ###
