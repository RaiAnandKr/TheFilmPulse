"""Add claimed_user_id in voucher code

Revision ID: 2974839ce71b
Revises: 1df48155ec4b
Create Date: 2024-06-23 07:14:21.924541

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2974839ce71b'
down_revision = '1df48155ec4b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('voucher_code', schema=None) as batch_op:
        batch_op.add_column(sa.Column('claimed_user_id', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('voucher_code', schema=None) as batch_op:
        batch_op.drop_column('claimed_user_id')

    # ### end Alembic commands ###