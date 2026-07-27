from setuptools import setup, find_packages

setup(
    name="helios_desk",
    version="0.1.0",
    description="Premium modern theme for Frappe / ERPNext",
    author="HeliosDesk",
    author_email="support@heliosdesk.io",
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    python_requires=">=3.10",
)
